import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Inquiry from '@/models/Inquiry.mjs';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { verifyAdminRole } from '@/lib/security/rbac';

export const runtime = 'nodejs';

// POST: Public lead generation / quote inquiry submission
export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const productCategory = typeof body?.productCategory === 'string' ? body.productCategory.trim() : 'Precast Boundary Wall';
    const location = typeof body?.location === 'string' ? body.location.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const lengthFeet = Number(body?.lengthFeet) || null;
    const heightFeet = Number(body?.heightFeet) || null;

    if (!name || name.length < 2) {
        return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!phone || phone.length < 8) {
        return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
    }

    try {
        await dbConnect();
        const inquiry = await Inquiry.create({
            name,
            phone,
            email,
            productCategory,
            location,
            message,
            lengthFeet,
            heightFeet,
            status: 'new',
        });

        return NextResponse.json(
            {
                ok: true,
                message: 'Inquiry submitted successfully! Our technical team will reach out within 24 hours.',
                id: inquiry._id.toString(),
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('Error creating inquiry:', err.message);
        return NextResponse.json(
            { error: 'Could not record inquiry. Please call our sales desk directly.' },
            { status: 500 }
        );
    }
}

// GET: Authenticated Admin retrieval of inquiries
export async function GET(request) {
    const response = NextResponse.json({ ok: true });
    const { supabase } = createSupabaseServerClient({ request, response });

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !verifyAdminRole(user)) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    try {
        await dbConnect();
        const inquiries = await Inquiry.find({})
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        return NextResponse.json({ ok: true, inquiries });
    } catch (err) {
        console.error('Error fetching inquiries:', err);
        return NextResponse.json({ error: 'Database error fetching inquiries.' }, { status: 500 });
    }
}

