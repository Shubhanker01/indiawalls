// Run with: node --env-file=.env.local scripts/seed-clients.mjs
// Safe to re-run: clients are upserted by slug.
import mongoose from 'mongoose';
import Client from '../src/models/Client.mjs';

const clients = [
    { name: 'Tata', slug: 'tata', logo: 'Tata.webp', order: 1 },
    { name: 'Adani', slug: 'adani', logo: 'adani.webp', order: 2 },
    { name: 'One Group', slug: 'one-group', logo: 'OneGroup.webp', order: 3 },
    { name: 'Nagar Nigam', slug: 'nagar-nigam', logo: 'municipal.webp', order: 4 },
    { name: 'Indian Railways', slug: 'indian-railways', logo: 'IndianRailways.webp', order: 5 },
    { name: 'Humanity Ahead', slug: 'humanity-ahead', logo: 'HumanityAhead.webp', order: 6 },
    { name: 'Nagar Vikas', slug: 'nagar-vikas', logo: 'NagarVikas.webp', order: 7 },
    { name: 'Essel', slug: 'essel', logo: 'Essel.webp', order: 8 },
    { name: 'Aviana', slug: 'aviana', logo: 'Aviana.jpg', order: 9 },
    {
        name: 'Bhaskar Jyoti',
        slug: 'bhaskar-jyoti',
        logo: 'Bhaskar%20Jyoti%20(India%20Pvt%20Ltd).png',
        order: 10,
    },
    { name: 'ats', slug: 'ats', logo: 'ats.png', order: 11 },
    {
        name: 'Bharta Construction',
        slug: 'bharta-construction',
        logo: 'Bharata%20Construction.png',
        order: 12,
    },
    {
        name: 'cosine power',
        slug: 'cosine-power',
        logo: 'Cosine%20Power%20Ltd.jpg',
        order: 13,
    },
    { name: 'Modi Groups', slug: 'modi-groups', logo: 'modi%20groups.jpg', order: 14 },
    { name: 'DCC Infra', slug: 'dcc-infra', logo: 'dcc_infra.jpg', order: 15 },
].map((client) => ({ ...client, published: true }));

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error(
        'MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/seed-clients.mjs'
    );
    process.exit(1);
}

try {
    for (const client of clients) {
        await new Client(client).validate();
    }

    await mongoose.connect(uri);
    const result = await Client.bulkWrite(
        clients.map((client) => ({
            updateOne: {
                filter: { slug: client.slug },
                update: { $set: client },
                upsert: true,
            },
        }))
    );
    console.log(
        `Seeded clients: ${result.upsertedCount} created, ${result.modifiedCount} updated.`
    );
} catch (error) {
    console.error('Client seeding failed:', error);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
