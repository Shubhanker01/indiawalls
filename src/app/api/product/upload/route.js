import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const uploadsDirectory = path.join(process.cwd(), 'public', 'uploads');
const uploadsDataFile = path.join(process.cwd(), 'src', 'data', 'uploads.json');

export async function POST(request) {
    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: 'Authentication is required.' }, { status: 401 });
    }

    let formData;

    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
    }

    const projectName = formData.get('projectName')?.toString().trim();
    const clientName = formData.get('clientName')?.toString().trim();
    const location = formData.get('location')?.toString().trim();
    const requirements = formData.get('requirements')?.toString().trim();
    const image = formData.get('image');

    if (!projectName || !clientName || !location || !requirements || !(image instanceof File)) {
        return NextResponse.json(
            { error: 'Project details and an image are required.' },
            { status: 400 }
        );
    }

    if (!image.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    const fileExtension = image.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;
    const imagePath = path.join(uploadsDirectory, fileName);
    const fileBuffer = Buffer.from(await image.arrayBuffer());

    try {
        await mkdir(uploadsDirectory, { recursive: true });
        await writeFile(imagePath, fileBuffer);
    } catch {
        return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
    }

    let uploads;

    try {
        const uploadsFile = await readFile(uploadsDataFile, 'utf8');
        uploads = JSON.parse(uploadsFile);
    } catch {
        uploads = [];
    }

    if (!Array.isArray(uploads)) {
        return NextResponse.json({ error: 'Upload data could not be read.' }, { status: 500 });
    }

    const upload = {
        id: randomUUID(),
        projectName,
        clientName,
        location,
        requirements,
        imageName: image.name,
        imageUrl: `/uploads/${fileName}`,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
    };

    uploads.push(upload);

    try {
        await writeFile(uploadsDataFile, `${JSON.stringify(uploads, null, 2)}\n`, 'utf8');
    } catch {
        await unlink(imagePath).catch(() => {});
        return NextResponse.json({ error: 'Upload data could not be saved.' }, { status: 500 });
    }

    const resultResponse = NextResponse.json({ ok: true, upload }, { status: 201 });
    getResponse().cookies.getAll().forEach((cookie) => resultResponse.cookies.set(cookie));

    return resultResponse;
}
