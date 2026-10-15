import dbConnect from '@/lib/dbConnect.js';
import Client from '@/models/Client.mjs';

export async function getClients() {
    await dbConnect();
    const clients = await Client.find({ published: true })
        .sort({ order: 1, name: 1 })
        .select('name slug logo')
        .lean();

    return clients.map(({ _id, ...client }) => ({
        ...client,
        id: String(_id),
    }));
}
