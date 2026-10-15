import dbConnect from '@/lib/dbConnect.js';
import ManufacturingUnit from '@/models/ManufacturingUnit.mjs';

export async function getManufacturingUnits() {
    await dbConnect();
    const units = await ManufacturingUnit.find({ published: true })
        .sort({ order: 1, city: 1 })
        .select('city slug region address lat lng mapsUrl')
        .lean();

    return units.map(({ _id, ...unit }) => ({
        ...unit,
        id: String(_id),
    }));
}
