import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateImageMagicBytes, verifyAdminRole } from '@/lib/security/rbac';
import dbConnect from '@/lib/dbConnect';
import { getProducts } from '@/lib/products';
import Product from '@/models/Product.mjs';
import ProductDetail from '@/models/ProductDetail.mjs';

export const runtime = 'nodejs';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 20;
const IMAGE_EXTENSIONS = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};
const STORAGE_BUCKET = process.env.SUPABASE_BUCKET || 'images';

const copyAuthCookies = (source, destination) => {
    source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
    return destination;
};

const slugify = (value) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);

function parseJsonField(formData, name, defaultValue, isValid) {
    const value = formData.get(name);
    if (value === null || value === '') return { value: defaultValue };
    if (typeof value !== 'string') return { error: `${name} must be JSON.` };

    try {
        const parsed = JSON.parse(value);
        return isValid(parsed) ? { value: parsed } : { error: `${name} has an invalid format.` };
    } catch {
        return { error: `${name} must be valid JSON.` };
    }
}

const isStringArray = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === 'string' && item.trim());

const isTechnicalSpecsArray = (value) =>
    Array.isArray(value) &&
    value.every(
        (item) =>
            item &&
            typeof item === 'object' &&
            typeof item.feature === 'string' &&
            item.feature.trim() &&
            typeof item.detail === 'string' &&
            item.detail.trim()
    );

const isBenefitsArray = (value) =>
    Array.isArray(value) &&
    value.every(
        (item) =>
            item &&
            typeof item === 'object' &&
            typeof item.title === 'string' &&
            item.title.trim() &&
            typeof item.text === 'string' &&
            item.text.trim() &&
            (item.icon === undefined || typeof item.icon === 'string')
    );

const isOptionalText = (value) => value === undefined || typeof value === 'string';

const isImageObject = (value) =>
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.src === 'string' &&
    value.src.trim() &&
    (value.alt === undefined || typeof value.alt === 'string') &&
    (value.caption === undefined || typeof value.caption === 'string');

const isGallery = (value) => Array.isArray(value) && value.every(isImageObject);

const isHero = (value) =>
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ['eyebrow', 'title', 'intro', 'ctaLabel'].every((key) => isOptionalText(value[key])) &&
    (value.captions === undefined ||
        (Array.isArray(value.captions) &&
            value.captions.every((caption) => typeof caption === 'string'))) &&
    (value.image === undefined || value.image === null || isImageObject(value.image));

const isInstallationSteps = (value) =>
    Array.isArray(value) &&
    value.every(
        (step) =>
            step &&
            typeof step === 'object' &&
            !Array.isArray(step) &&
            typeof step.title === 'string' &&
            step.title.trim() &&
            isOptionalText(step.description) &&
            isOptionalText(step.image)
    );

const isManufacturingSteps = (value) =>
    Array.isArray(value) &&
    value.every(
        (step) =>
            step &&
            typeof step === 'object' &&
            !Array.isArray(step) &&
            isOptionalText(step.step) &&
            typeof step.title === 'string' &&
            step.title.trim() &&
            typeof step.description === 'string' &&
            step.description.trim() &&
            isOptionalText(step.image)
    );

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

export async function GET(request) {
    try {
        if (request.nextUrl.searchParams.get('adminCatalog') === '1') {
            const initialResponse = NextResponse.json({ ok: true });
            const { supabase, getResponse } = createSupabaseServerClient({
                request,
                response: initialResponse,
            });
            const reply = (body, status = 200) =>
                copyAuthCookies(getResponse(), NextResponse.json(body, { status }));
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
                console.error('Failed to verify MFA level:', assuranceError.message);
                return reply({ error: 'Could not verify authentication level.' }, 500);
            }
            if (assurance?.currentLevel !== 'aal2') {
                return reply({ error: 'MFA verification required (AAL2).' }, 403);
            }

            await dbConnect();
            const products = await Product.find({})
                .select('title slug badge description longDescription image specs order published')
                .sort({ order: 1, title: 1 })
                .lean();

            return reply({
                products: products.map(({ _id, ...product }) => ({
                    ...product,
                    id: String(_id),
                })),
            });
        }

        const slug = request.nextUrl.searchParams.get('slug')?.trim().toLowerCase();
        if (slug) {
            await dbConnect();
            const product = await Product.findOne({ slug, published: true })
                .select('title slug badge description longDescription image specs')
                .lean();
            if (!product) {
                return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
            }

            const productDetail = await ProductDetail.findOne({ productSlug: slug })
                .select(
                    'benefitsIntro benefitsTitle gallery hero installationSteps installationTitle manufacturingSteps processTitle'
                )
                .lean();
            return NextResponse.json({
                product: {
                    ...product,
                    id: product._id.toString(),
                    _id: undefined,
                },
                productDetail: productDetail
                    ? {
                        ...productDetail,
                        _id: undefined,
                        __v: undefined,
                        productSlug: undefined,
                    }
                    : {},
            });
        }

        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
    }
}

export async function POST(request) {
    const initialResponse = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({
        request,
        response: initialResponse,
    });
    const reply = (body, status = 200) =>
        copyAuthCookies(getResponse(), NextResponse.json(body, { status }));

    try {
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

        let formData;
        try {
            formData = await request.formData();
        } catch {
            return reply({ error: 'Invalid form data.' }, 400);
        }

        const getText = (name) => {
            const value = formData.get(name);
            return typeof value === 'string' ? value.trim() : '';
        };

        const title = getText('title');
        const badge = getText('badge');
        const description = getText('description');
        const longDescription = getText('longDescription');
        const benefitsTitle = getText('benefitsTitle');
        const benefitsIntro = getText('benefitsIntro');
        const image = formData.get('image');
        const galleryFiles = formData.getAll('gallery');

        if (!title || !description || !(image instanceof File)) {
            return reply(
                { error: 'Title, description, and a primary image are required.' },
                400
            );
        }
        if (galleryFiles.length > MAX_GALLERY_IMAGES) {
            return reply({ error: `A maximum of ${MAX_GALLERY_IMAGES} gallery images is allowed.` }, 400);
        }

        const parsedSpecs = parseJsonField(formData, 'specs', [], isStringArray);
        const parsedTechnicalSpecs = parseJsonField(
            formData,
            'technicalSpecs',
            [],
            isTechnicalSpecsArray
        );
        const parsedBenefits = parseJsonField(formData, 'benefits', [], isBenefitsArray);
        const invalidField = [parsedSpecs, parsedTechnicalSpecs, parsedBenefits].find(
            (result) => result.error
        );
        if (invalidField) return reply({ error: invalidField.error }, 400);

        const files = [image, ...galleryFiles];
        const imageBuffers = [];
        for (const file of files) {
            if (!(file instanceof File)) {
                return reply({ error: 'Invalid primary or gallery image.' }, 400);
            }
            if (!IMAGE_EXTENSIONS[file.type]) {
                return reply({ error: 'Only JPG, PNG, or WebP images are allowed.' }, 400);
            }
            if (file.size > MAX_IMAGE_BYTES) {
                return reply({ error: 'Each image must be 4 MB or smaller.' }, 413);
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            if (!validateImageMagicBytes(buffer, file.type)) {
                return reply(
                    { error: `Image "${file.name}" failed file signature verification.` },
                    400
                );
            }
            imageBuffers.push({ file, buffer });
        }

        const uploadedPaths = [];
        const cleanupUploads = async () => {
            if (uploadedPaths.length === 0) return;
            try {
                const { error } = await supabaseAdmin.storage
                    .from(STORAGE_BUCKET)
                    .remove(uploadedPaths);
                if (error) console.error('Product image cleanup failed:', error.message);
            } catch (error) {
                console.error('Product image cleanup failed:', error);
            }
        };

        try {
            await dbConnect();

            const uploadedGallery = [];
            let imagePath;
            for (const [index, { file, buffer }] of imageBuffers.entries()) {
                const storagePath = `products/${randomUUID()}.${IMAGE_EXTENSIONS[file.type]}`;
                const { error: uploadError } = await supabaseAdmin.storage
                    .from(STORAGE_BUCKET)
                    .upload(storagePath, buffer, {
                        contentType: file.type,
                        cacheControl: '31536000',
                        upsert: false,
                    });

                if (uploadError) {
                    console.error('Product image upload failed:', uploadError.message);
                    await cleanupUploads();
                    return reply({ error: 'Product image upload failed.' }, 500);
                }

                uploadedPaths.push(storagePath);
                if (index === 0) {
                    imagePath = storagePath;
                } else {
                    uploadedGallery.push({
                        src: storagePath,
                        alt: `${title} gallery image ${index}`,
                    });
                }
            }

            const slug = `${slugify(title) || 'product'}-${randomUUID().slice(0, 8)}`;
            const product = await Product.create({
                title,
                slug,
                badge,
                description,
                longDescription,
                image: imagePath,
                specs: parsedSpecs.value.map((spec) => spec.trim()),
                order: 0,
                published: true,
            });

            let productDetail;
            try {
                productDetail = await ProductDetail.create({
                    productSlug: slug,
                    benefitsTitle,
                    benefitsIntro,
                    benefits: parsedBenefits.value,
                    gallery: uploadedGallery,
                    technicalSpecs: parsedTechnicalSpecs.value,
                });
            } catch (error) {
                await Product.deleteOne({ _id: product._id });
                throw error;
            }
            uploadedPaths.length = 0;
            revalidatePath('/products');
            revalidatePath(`/products/${slug}`);

            return reply(
                {
                    ok: true,
                    product: {
                        id: product._id.toString(),
                        title: product.title,
                        slug: product.slug,
                        badge: product.badge,
                        description: product.description,
                        image: product.image,
                        specs: product.specs,
                    },
                    productDetail: {
                        id: productDetail._id.toString(),
                        productSlug: productDetail.productSlug,
                        benefitsTitle: productDetail.benefitsTitle,
                        benefitsIntro: productDetail.benefitsIntro,
                        gallery: productDetail.gallery,
                        technicalSpecs: productDetail.technicalSpecs,
                    },
                },
                201
            );
        } catch (error) {
            await cleanupUploads();
            if (error?.code === 11000) {
                return reply({ error: 'A product with this slug already exists.' }, 409);
            }
            console.error('Failed to create product and details:', error);
            return reply({ error: 'Product and detailed specifications could not be saved.' }, 500);
        }
    } catch (error) {
        console.error('Failed to create product:', error);
        return reply({ error: 'Failed to create product.' }, 500);
    }
}

export async function PUT(request) {
    const initialResponse = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({
        request,
        response: initialResponse,
    });
    const reply = (body, status = 200) =>
        copyAuthCookies(getResponse(), NextResponse.json(body, { status }));
    const uploadedGalleryPaths = [];
    const cleanupGalleryUploads = async () => {
        if (uploadedGalleryPaths.length === 0) return;
        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .remove(uploadedGalleryPaths);
        if (error) {
            console.error('Product gallery upload cleanup failed:', error.message);
        }
    };

    try {
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

        let body;
        let galleryFiles = [];
        try {
            if (request.headers.get('content-type')?.includes('multipart/form-data')) {
                const formData = await request.formData();
                const payload = formData.get('payload');
                if (typeof payload !== 'string') {
                    return reply({ error: 'Product update payload is required.' }, 400);
                }
                body = JSON.parse(payload);
                galleryFiles = formData.getAll('galleryFiles');
            } else {
                body = await request.json();
            }
        } catch {
            return reply({ error: 'Invalid request body.' }, 400);
        }

        const productInput = body?.product;
        const detailInput = body?.productDetail;
        if (
            !productInput ||
            typeof productInput !== 'object' ||
            Array.isArray(productInput) ||
            !detailInput ||
            typeof detailInput !== 'object' ||
            Array.isArray(detailInput)
        ) {
            return reply(
                { error: 'Provide product and productDetail objects.' },
                400
            );
        }

        const title = typeof productInput.title === 'string' ? productInput.title.trim() : '';
        const description =
            typeof productInput.description === 'string' ? productInput.description.trim() : '';
        if (!title || !description) {
            return reply({ error: 'Product title and description are required.' }, 400);
        }
        if (
            (hasOwn(productInput, 'badge') && !isOptionalText(productInput.badge)) ||
            (hasOwn(productInput, 'specs') && !isStringArray(productInput.specs))
        ) {
            return reply({ error: 'Product badge or specs has an invalid format.' }, 400);
        }

        const slug = detailInput.slug === undefined
            ? ''
            : typeof detailInput.slug === 'string'
                ? detailInput.slug.trim().toLowerCase()
                : null;
        if (
            slug === null ||
            (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
        ) {
            return reply({ error: 'Product detail slug has an invalid format.' }, 400);
        }

        const detailValidators = {
            benefitsIntro: isOptionalText,
            benefitsTitle: isOptionalText,
            hero: isHero,
            installationSteps: isInstallationSteps,
            installationTitle: isOptionalText,
            manufacturingSteps: isManufacturingSteps,
            processTitle: isOptionalText,
        };
        for (const [field, validator] of Object.entries(detailValidators)) {
            if (hasOwn(detailInput, field) && !validator(detailInput[field])) {
                return reply({ error: `Product detail field "${field}" has an invalid format.` }, 400);
            }
        }
        if (hasOwn(detailInput, 'gallery')) {
            return reply({ error: 'Gallery images must be uploaded as image files.' }, 400);
        }
        if (galleryFiles.length > MAX_GALLERY_IMAGES) {
            return reply(
                { error: `A maximum of ${MAX_GALLERY_IMAGES} gallery images is allowed.` },
                400
            );
        }
        if (galleryFiles.some((file) => !(file instanceof File))) {
            return reply({ error: 'Gallery entries must be uploaded image files.' }, 400);
        }

        await dbConnect();
        const product = await Product.findOne(
            slug ? { slug } : { title }
        );
        if (!product) {
            return reply({ error: 'Product not found.' }, 404);
        }

        const previousSlug = product.slug;
        const nextSlug = slug || previousSlug;
        if (nextSlug !== previousSlug) {
            const existingSlug = await Product.findOne({ slug: nextSlug, _id: { $ne: product._id } })
                .select('_id')
                .lean();
            if (existingSlug) {
                return reply({ error: 'That product slug is already in use.' }, 409);
            }
        }

        const detail = await ProductDetail.findOne({ productSlug: previousSlug });
        if (galleryFiles.length > 0 && detail?.gallery?.length > 0) {
            return reply(
                { error: 'Gallery images can only be added when the product gallery is empty.' },
                400
            );
        }

        const uploadedGallery = [];
        for (const [index, file] of galleryFiles.entries()) {
            if (!IMAGE_EXTENSIONS[file.type]) {
                return reply({ error: 'Only JPG, PNG, or WebP gallery images are allowed.' }, 400);
            }
            if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
                return reply({ error: 'Each gallery image must be larger than 0 bytes and 4 MB or smaller.' }, 413);
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            if (!validateImageMagicBytes(buffer, file.type)) {
                return reply(
                    { error: `Gallery image "${file.name}" failed file signature verification.` },
                    400
                );
            }

            const storagePath = `products/${randomUUID()}.${IMAGE_EXTENSIONS[file.type]}`;
            const { error: uploadError } = await supabaseAdmin.storage
                .from(STORAGE_BUCKET)
                .upload(storagePath, buffer, {
                    contentType: file.type,
                    cacheControl: '31536000',
                    upsert: false,
                });
            if (uploadError) {
                console.error('Product gallery upload failed:', uploadError.message);
                await cleanupGalleryUploads();
                return reply({ error: 'Product gallery upload failed.' }, 500);
            }

            uploadedGalleryPaths.push(storagePath);
            uploadedGallery.push({
                src: storagePath,
                alt: file.name || `Product gallery image ${index + 1}`,
            });
        }

        const nextProduct = {
            ...product.toObject(),
            title,
            description,
            slug: nextSlug,
            ...(hasOwn(productInput, 'badge') ? { badge: productInput.badge.trim() } : {}),
            ...(hasOwn(productInput, 'specs')
                ? { specs: productInput.specs.map((spec) => spec.trim()) }
                : {}),
        };
        const nextDetail = {
            ...(detail?.toObject() || {}),
            productSlug: nextSlug,
            ...Object.fromEntries(
                Object.keys(detailValidators)
                    .filter((field) => hasOwn(detailInput, field))
                    .map((field) => [field, detailInput[field]])
            ),
            ...(uploadedGallery.length > 0 ? { gallery: uploadedGallery } : {}),
        };

        const productDocument = new Product(nextProduct);
        const detailDocument = new ProductDetail(nextDetail);
        await Promise.all([productDocument.validate(), detailDocument.validate()]);

        const previousProductValues = {
            title: product.title,
            description: product.description,
            slug: product.slug,
            badge: product.badge,
            specs: product.specs,
        };
        const previousDetailValues = detail?.toObject();

        try {
            Object.assign(product, {
                title,
                description,
                slug: nextSlug,
                ...(hasOwn(productInput, 'badge') ? { badge: productInput.badge.trim() } : {}),
                ...(hasOwn(productInput, 'specs')
                    ? { specs: productInput.specs.map((spec) => spec.trim()) }
                    : {}),
            });
            await product.save();

            if (detail) {
                Object.assign(detail, nextDetail);
                await detail.save();
            } else {
                await ProductDetail.create(nextDetail);
            }
            uploadedGalleryPaths.length = 0;
        } catch (saveError) {
            Object.assign(product, previousProductValues);
            await product.save().catch((rollbackError) => {
                console.error('Product update rollback failed:', rollbackError);
            });

            if (detail && previousDetailValues) {
                Object.assign(detail, previousDetailValues);
                await detail.save().catch((rollbackError) => {
                    console.error('Product detail update rollback failed:', rollbackError);
                });
            } else if (!detail) {
                await ProductDetail.deleteOne({ productSlug: nextSlug });
            }
            throw saveError;
        }

        revalidatePath('/products');
        revalidatePath(`/products/${previousSlug}`);
        if (nextSlug !== previousSlug) {
            revalidatePath(`/products/${nextSlug}`);
        }

        return reply({
            ok: true,
            product: {
                title: product.title,
                description: product.description,
                badge: product.badge,
                specs: product.specs,
                slug: product.slug,
            },
            productDetail: {
                productSlug: nextSlug,
                benefitsIntro: detail?.benefitsIntro ?? nextDetail.benefitsIntro,
                benefitsTitle: detail?.benefitsTitle ?? nextDetail.benefitsTitle,
                gallery: detail?.gallery ?? nextDetail.gallery,
                hero: detail?.hero ?? nextDetail.hero,
                installationSteps: detail?.installationSteps ?? nextDetail.installationSteps,
                installationTitle: detail?.installationTitle ?? nextDetail.installationTitle,
                manufacturingSteps: detail?.manufacturingSteps ?? nextDetail.manufacturingSteps,
                processTitle: detail?.processTitle ?? nextDetail.processTitle,
            },
        });
    } catch (error) {
        try {
            await cleanupGalleryUploads();
        } catch (cleanupError) {
            console.error('Product gallery upload cleanup failed:', cleanupError);
        }
        if (error?.name === 'ValidationError' || error?.name === 'CastError') {
            return reply({ error: error.message }, 400);
        }
        if (error?.code === 11000) {
            return reply({ error: 'That product slug is already in use.' }, 409);
        }
        console.error('Failed to update product and details:', error);
        return reply({ error: 'Product and details could not be updated.' }, 500);
    }
}

export async function DELETE(request) {
    const initialResponse = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({
        request,
        response: initialResponse,
    });
    const reply = (body, status = 200) =>
        copyAuthCookies(getResponse(), NextResponse.json(body, { status }));

    try {
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

        let body;
        try {
            body = await request.json();
        } catch {
            return reply({ error: 'Invalid request body.' }, 400);
        }

        const title = typeof body?.title === 'string' ? body.title.trim() : '';
        if (!title) {
            return reply({ error: 'A product title is required.' }, 400);
        }

        await dbConnect();
        const product = await Product.findOne({ title }).select('_id title slug image').lean();
        if (!product) {
            return reply({ error: 'Product not found.' }, 404);
        }

        const productDetail = await ProductDetail.findOne({ productSlug: product.slug })
            .select('gallery.src')
            .lean();

        await Product.deleteOne({ _id: product._id });
        await ProductDetail.deleteOne({ productSlug: product.slug });

        const imagePaths = [
            product.image,
            ...(productDetail?.gallery || []).map((image) => image.src),
        ].filter((path) => typeof path === 'string' && path.startsWith('products/'));
        if (imagePaths.length > 0) {
            const { error: storageError } = await supabaseAdmin.storage
                .from(STORAGE_BUCKET)
                .remove([...new Set(imagePaths)]);
            if (storageError) {
                console.error('Deleted product image cleanup failed:', storageError.message);
                revalidatePath('/products');
                revalidatePath(`/products/${product.slug}`);
                return reply(
                    {
                        error: 'Product was deleted, but its stored images could not be removed.',
                        productDeleted: true,
                    },
                    500
                );
            }
        }

        revalidatePath('/products');
        revalidatePath(`/products/${product.slug}`);
        return reply({ ok: true, product: { title: product.title } });
    } catch (error) {
        console.error('Failed to delete product:', error);
        return reply({ error: 'Failed to delete product.' }, 500);
    }
}
