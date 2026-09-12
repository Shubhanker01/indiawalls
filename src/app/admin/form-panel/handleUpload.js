'use server';

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const uploadsDirectory = path.join(process.cwd(), 'public', 'uploads');
const uploadsDataFile = path.join(process.cwd(), 'src', 'data', 'uploads.json');

export async function handleUpload(_previousState, formData) {
    const projectName = formData.get('projectName')?.toString().trim();
    const clientName = formData.get('clientName')?.toString().trim();
    const location = formData.get('location')?.toString().trim();
    const requirements = formData.get('requirements')?.toString().trim();
    const image = formData.get('image');

    if (!projectName || !clientName || !location || !requirements || !(image instanceof File)) {
        return { error: 'Project details and an image are required.' };
    }

    if (!image.type.startsWith('image/')) {
        return { error: 'Only image files are allowed.' };
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: 'Authentication is required.' };
    }

    const fileExtension = image.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;
    const imagePath = path.join(uploadsDirectory, fileName);
    const fileBuffer = Buffer.from(await image.arrayBuffer());

    try {
        await mkdir(uploadsDirectory, { recursive: true });
        await writeFile(imagePath, fileBuffer);
    } catch {
        return { error: 'Image upload failed.' };
    }

    let uploads;

    try {
        const uploadsFile = await readFile(uploadsDataFile, 'utf8');
        uploads = JSON.parse(uploadsFile);
    } catch {
        uploads = [];
    }

    if (!Array.isArray(uploads)) {
        await unlink(imagePath).catch(() => {});
        return { error: 'Upload data could not be read.' };
    }

    uploads.push({
        id: randomUUID(),
        projectName,
        clientName,
        location,
        requirements,
        imageName: image.name,
        imageUrl: `/uploads/${fileName}`,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
    });

    try {
        await writeFile(uploadsDataFile, `${JSON.stringify(uploads, null, 2)}\n`, 'utf8');
    } catch {
        await unlink(imagePath).catch(() => {});
        return { error: 'Upload data could not be saved.' };
    }

    return { success: true };
}