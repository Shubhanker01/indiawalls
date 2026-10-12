import dbConnect from '@/lib/dbConnect.js';
import Project from '@/models/Project.mjs';
import { assetSrc } from '@/lib/api/getProductDetails.js';

const FIELDS = 'title slug category productSlug location description image gallery';

export async function getProjects() {
    await dbConnect();
    const docs = await Project.find({ published: true }).sort({ order: 1 }).select(FIELDS).lean();

    return docs.map(({ _id, image, gallery = [], ...rest }) => ({
        id: String(_id),
        ...rest,
        image: assetSrc(image),
        gallery: gallery.map((g) => ({ ...g, src: assetSrc(g.src) })),
    }));
}