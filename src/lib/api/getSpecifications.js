import dbConnect from '@/lib/dbConnect.js';
import Specification from '@/models/Specification.mjs';

export async function getSpecifications() {
    await dbConnect();
    const documents = await Specification.find({ published: true })
        .sort({ specificationName: 1 })
        .select('specificationName slug label description specifications image')
        .lean();

    return documents.map(({ _id, ...specification }) => ({
        ...specification,
        id: String(_id),
    }));
}
