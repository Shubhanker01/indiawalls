import { apiResponse } from '@/lib/api/response';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { verifyAdminRole } from '@/lib/security/rbac';
import dbConnect from '@/lib/dbConnect';
import ManufacturingUnit from '@/models/ManufacturingUnit.mjs';

export const runtime = 'nodejs';

function copyCookies(source, destination) {
    source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
    return destination;
}

function getReply(request) {
    const initialResponse = apiResponse({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({
        request,
        response: initialResponse,
    });
    const reply = (body, status = 200) =>
        copyCookies(getResponse(), apiResponse(body, { status }));
    return { supabase, reply };
}

async function authorize(supabase, reply) {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
        return reply({ error: 'Authentication is required.' }, 401);
    }
    if (!verifyAdminRole(user)) {
        return reply({ error: 'Forbidden: Admin role required.' }, 403);
    }

    const { data: assurance, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) {
        console.error('Failed to verify MFA level:', assuranceError);
        return reply({ error: 'Could not verify authentication level.' }, 500);
    }
    if (assurance?.currentLevel !== 'aal2') {
        return reply({ error: 'MFA verification required (AAL2).' }, 403);
    }
    return null;
}

const text = (value) => (typeof value === 'string' ? value.trim() : '');

function parseCoordinate(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim()) return Number(value);
    return Number.NaN;
}

function hasCoordinateValue(value) {
    return value !== undefined && value !== null && value !== '';
}

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80);
}

export async function GET(request) {
    const { supabase, reply } = getReply(request);
    const denied = await authorize(supabase, reply);
    if (denied) return denied;

    try {
        await dbConnect();
        const units = await ManufacturingUnit.find({})
            .sort({ order: 1, city: 1 })
            .select('city slug address mapsUrl region lat lng order published')
            .lean();

        return reply({
            units: units.map(({ _id, ...unit }) => ({
                ...unit,
                id: String(_id),
            })),
        });
    } catch (error) {
        console.error('Failed to load manufacturing units for admin:', error);
        return reply({ error: 'Failed to load manufacturing units.' }, 500);
    }
}

export async function POST(request) {
    const { supabase, reply } = getReply(request);
    const denied = await authorize(supabase, reply);
    if (denied) return denied;

    let body;
    try {
        body = await request.json();
    } catch {
        return reply({ error: 'Invalid request body.' }, 400);
    }

    const city = text(body?.city);
    const region = text(body?.region ?? body?.state);
    const address = text(body?.address);
    const mapsUrl = text(body?.url ?? body?.mapsUrl);
    const latitudeValue = body?.latitude ?? body?.lat;
    const longitudeValue = body?.longitude ?? body?.lng;
    const hasLatitude = hasCoordinateValue(latitudeValue);
    const hasLongitude = hasCoordinateValue(longitudeValue);
    const lat = hasLatitude ? parseCoordinate(latitudeValue) : undefined;
    const lng = hasLongitude ? parseCoordinate(longitudeValue) : undefined;

    if (!city) {
        return reply({ error: 'A city is required.' }, 400);
    }
    if (
        city.length > 120 ||
        region.length > 120 ||
        address.length > 300 ||
        mapsUrl.length > 2000
    ) {
        return reply({ error: 'One or more fields exceed the allowed length.' }, 400);
    }
    if (mapsUrl) {
        try {
            const parsedUrl = new URL(mapsUrl);
            if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
                return reply({ error: 'The map URL must use HTTP or HTTPS.' }, 400);
            }
        } catch {
            return reply({ error: 'The map URL is invalid.' }, 400);
        }
    }

    if (
        (hasLatitude && (!Number.isFinite(lat) || lat < -90 || lat > 90)) ||
        (hasLongitude && (!Number.isFinite(lng) || lng < -180 || lng > 180))
    ) {
        return reply({ error: 'Latitude or longitude is outside the valid range.' }, 400);
    }

    const slugBase = slugify(city);
    if (!slugBase) {
        return reply({ error: 'City must contain at least one letter or number.' }, 400);
    }

    try {
        await dbConnect();
        const order = (await ManufacturingUnit.countDocuments({})) + 1;
        const unit = await ManufacturingUnit.create({
            city,
            slug: `${slugBase}-${randomUUID().slice(0, 8)}`,
            region,
            address,
            mapsUrl,
            ...(hasLatitude ? { lat } : {}),
            ...(hasLongitude ? { lng } : {}),
            order,
            published: true,
        });

        revalidatePath('/');
        return reply(
            {
                ok: true,
                unit: {
                    id: unit._id.toString(),
                    city: unit.city,
                    slug: unit.slug,
                    region: unit.region,
                    address: unit.address,
                    mapsUrl: unit.mapsUrl,
                    lat: unit.lat,
                    lng: unit.lng,
                },
            },
            201
        );
    } catch (error) {
        if (error?.name === 'ValidationError' || error?.name === 'CastError') {
            return reply({ error: error.message }, 400);
        }
        console.error('Failed to create manufacturing unit:', error);
        return reply({ error: 'Failed to create manufacturing unit.' }, 500);
    }
}

export async function PUT(request) {
    const { supabase, reply } = getReply(request);
    const denied = await authorize(supabase, reply);
    if (denied) return denied;

    const slug = request.nextUrl.searchParams.get('slug')?.trim().toLowerCase();
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return reply({ error: 'A valid manufacturing unit slug is required.' }, 400);
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return reply({ error: 'Invalid request body.' }, 400);
    }

    if (
        typeof body?.city !== 'string' ||
        typeof body?.address !== 'string' ||
        typeof body?.mapsUrl !== 'string' ||
        typeof body?.region !== 'string'
    ) {
        return reply({ error: 'City, address, mapsUrl, and region must be provided as strings.' }, 400);
    }

    const city = text(body.city);
    const address = text(body.address);
    const mapsUrl = text(body.mapsUrl);
    const region = text(body.region);

    if (!city) {
        return reply({ error: 'A city is required.' }, 400);
    }
    if (city.length > 120 || address.length > 300 || mapsUrl.length > 2000 || region.length > 120) {
        return reply({ error: 'One or more fields exceed the allowed length.' }, 400);
    }
    if (mapsUrl) {
        try {
            const parsedUrl = new URL(mapsUrl);
            if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
                return reply({ error: 'The map URL must use HTTP or HTTPS.' }, 400);
            }
        } catch {
            return reply({ error: 'The map URL is invalid.' }, 400);
        }
    }

    try {
        await dbConnect();
        const unit = await ManufacturingUnit.findOneAndUpdate(
            { slug },
            { $set: { city, address, mapsUrl, region } },
            { new: true, runValidators: true }
        )
            .select('city slug address mapsUrl region lat lng')
            .lean();

        if (!unit) {
            return reply({ error: 'Manufacturing unit not found.' }, 404);
        }

        revalidatePath('/');
        return reply({
            ok: true,
            unit: {
                id: String(unit._id),
                city: unit.city,
                slug: unit.slug,
                address: unit.address,
                mapsUrl: unit.mapsUrl,
                region: unit.region,
                lat: unit.lat,
                lng: unit.lng,
            },
        });
    } catch (error) {
        if (error?.name === 'ValidationError' || error?.name === 'CastError') {
            return reply({ error: error.message }, 400);
        }
        console.error('Failed to update manufacturing unit:', error);
        return reply({ error: 'Failed to update manufacturing unit.' }, 500);
    }
}

export async function DELETE(request) {
    const { supabase, reply } = getReply(request);
    const denied = await authorize(supabase, reply);
    if (denied) return denied;

    let body;
    try {
        body = await request.json();
    } catch {
        return reply({ error: 'Invalid request body.' }, 400);
    }

    const city = text(body?.city);
    const address = text(body?.address);
    if (!city || typeof body?.address !== 'string') {
        return reply({ error: 'City and address are required.' }, 400);
    }
    if (city.length > 120 || address.length > 300) {
        return reply({ error: 'City or address exceeds the allowed length.' }, 400);
    }

    try {
        await dbConnect();
        const unit = await ManufacturingUnit.findOneAndDelete({ city, address })
            .select('city address')
            .lean();
        if (!unit) {
            return reply({ error: 'No manufacturing unit matched that city and address.' }, 404);
        }

        revalidatePath('/');
        return reply({
            ok: true,
            unit: {
                city: unit.city,
                address: unit.address,
            },
        });
    } catch (error) {
        console.error('Failed to delete manufacturing unit:', error);
        return reply({ error: 'Failed to delete manufacturing unit.' }, 500);
    }
}
