// Run with: node --env-file=.env.local scripts/seed-specifications.mjs
// Safe to re-run: specifications are upserted by slug.
import mongoose from 'mongoose';
import Specification from '../src/models/Specification.mjs';

const specifications = [
    {
        specificationName: 'Cement Sets (Pannel)',
        slug: 'cement-sets-pannel',
        label: 'Precast RCC Component',
        description:
            'Vertical concrete posts and horizontal panel manufactured with stressing system to achieve maximum durability and strength.',
        image: `${process.env.NEXT_PUBLIC_IMAGES}/specifications/CementSet-pannel.png`,
        specifications: [
            { label: 'Length', value: '6 Feet (1800mm/2150mm)' },
            { label: 'Height', value: '1 Feet (300mm)' },
            { label: 'Width / Thickness', value: '2 Inches (50mm)' },
            { label: 'Reinforcement', value: '3 pcs of 3mm/4mm PCC steel' },
        ],
        published: true,
    },
    {
        specificationName: 'RCC Columns',
        slug: 'rcc-columns',
        label: 'Precast RCC Component',
        description:
            'Precast RCC columns manufactured with a stressing system to securely lock boundary wall planks in place, delivering maximum stability and high wind resistance.',
        image: `${process.env.NEXT_PUBLIC_IMAGES}/specifications/Rcc_columns.png`,
        specifications: [
            { label: 'Cross Section', value: '6 x 6 Inches (150mm x 150mm)' },
            { label: 'Reinforcement', value: '7 Pieces of 3mm PCC Steel Wire' },
            { label: 'Technology', value: 'Stressing System' },
            { label: 'Length / Height', value: 'According to Customer Requirement' },
        ],
        published: true,
    },
    {
        specificationName: 'Prefabricated Folding Compound Wall',
        slug: 'compound-walls',
        label: 'Precast RCC Boundary System',
        description:
            'Heavy-duty precast prestressed concrete compound wall system. Built using high-durability interlocked horizontal planks fitted into RCC H-columns, offering rapid installation and reusable modular design.',
        image: `${process.env.NEXT_PUBLIC_IMAGES}/specifications/Compound-wall.png`,
        specifications: [
            { label: 'Available Wall Heights', value: '6 Feet' },
            { label: 'Panel Length', value: '6 Feet (1828.8mm)' },
            { label: 'Panel Height / Thickness', value: '1 Feet (300mm) / 2 Inches (50mm)' },
            { label: 'Column Dimension', value: '6 x 6 Inches (150mm x 150mm)' },
            { label: 'Column Total Length', value: '10 Feet (6ft above ground + 4ft in-ground)' },
            { label: 'Concrete Foundation', value: '2 Feet x 2 Feet poured base' },
        ],
        published: true,
    },
];

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error(
        'MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/seed-specifications.mjs'
    );
    process.exit(1);
}

try {
    await mongoose.connect(uri);
    const result = await Specification.bulkWrite(
        specifications.map((specification) => ({
            updateOne: {
                filter: { slug: specification.slug },
                update: { $set: specification, $unset: { order: '' } },
                upsert: true,
            },
        }))
    );
    console.log(
        `Seeded specifications: ${result.upsertedCount} created, ${result.modifiedCount} updated.`
    );
} catch (error) {
    console.error('Specification seeding failed:', error);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
