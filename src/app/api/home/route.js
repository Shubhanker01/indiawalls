import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { blogPosts } from '@/data/blogs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const uploadsDataFile = path.join(process.cwd(), 'src', 'data', 'uploads.json');

async function getUploadedProjects() {
    try {
        const uploadsFile = await readFile(uploadsDataFile, 'utf8');
        const uploads = JSON.parse(uploadsFile);
        return Array.isArray(uploads) ? uploads : [];
    } catch {
        return [];
    }
}

export async function GET() {
    const uploadedProjects = await getUploadedProjects();

    return NextResponse.json({
        page: 'home',
        sections: [
            'header',
            'navigation',
            'hero',
            'about',
            'why-us',
            'project-process',
            'product-catalog',
            'benefits',
            'our-work',
            'manufacturing-units',
            'testimonials',
            'clientele',
            'blogs',
            'faq',
            'footer',
        ],
        data: {
            uploadedProjects,
            blogPosts,
        },
    });
}