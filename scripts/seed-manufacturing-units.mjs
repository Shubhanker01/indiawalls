// Run with: node --env-file=.env.local scripts/seed-manufacturing-units.mjs
// Safe to re-run: units are upserted by slug.
import mongoose from 'mongoose';
import ManufacturingUnit from '../src/models/ManufacturingUnit.mjs';

const units = [
    {
        city: 'Kotkasim Unit',
        slug: 'kotkasim',
        region: 'Rajasthan',
        address: 'Kotkasim industrial area',
        lat: 27.70,
        lng: 76.63,
        mapsUrl: 'https://maps.google.com/?q=Kotkasim,Rajasthan',
        order: 1,
    },
    {
        city: 'Tapukara Unit',
        slug: 'tapukara',
        region: 'Rajasthan',
        address: 'Tapukara industrial area',
        lat: 28.1069973,
        lng: 76.8005187,
        mapsUrl: 'https://maps.google.com/?q=Tapukara,Rajasthan',
        order: 2,
    },
    {
        city: 'Alwar Unit',
        slug: 'alwar',
        region: 'Rajasthan',
        address: 'Alwar industrial area',
        lat: 27.553,
        lng: 76.634,
        mapsUrl: 'https://maps.google.com/?q=Alwar,Rajasthan',
        order: 3,
    },
    {
        city: 'Ringus Unit',
        slug: 'ringus',
        region: 'Rajasthan',
        address: 'Ringus industrial area',
        lat: 27.37,
        lng: 75.57,
        mapsUrl: 'https://maps.google.com/?q=Ringus,Rajasthan',
        order: 4,
    },
    {
        city: 'Ramgarh Unit',
        slug: 'ramgarh',
        region: 'Rajasthan',
        address: 'Ramgarh industrial area',
        lat: 27.57,
        lng: 76.87,
        mapsUrl: 'https://maps.google.com/?q=Ramgarh,Rajasthan',
        order: 5,
    },
    {
        city: 'Govindgarh Unit',
        slug: 'govindgarh',
        region: 'Rajasthan',
        address: 'Govindgarh industrial area',
        lat: 27.22,
        lng: 75.83,
        mapsUrl: 'https://maps.google.com/?q=Govindgarh,Rajasthan',
        order: 6,
    },
    {
        city: 'Mundawar Unit',
        slug: 'mundawar',
        region: 'Rajasthan',
        address: 'Mundawar industrial area',
        lat: 27.97,
        lng: 76.45,
        mapsUrl: 'https://maps.google.com/?q=Mundawar,Rajasthan',
        order: 7,
    },
    {
        city: 'Faridabad Unit',
        slug: 'faridabad',
        region: 'Haryana / NCR Zone',
        address: 'Faridabad industrial area',
        lat: 28.409,
        lng: 77.318,
        mapsUrl: 'https://maps.google.com/?q=Faridabad,Haryana',
        order: 8,
    },
    {
        city: 'Bahadurgarh Unit',
        slug: 'bahadurgarh',
        region: 'Haryana / NCR Zone',
        address: 'Bahadurgarh industrial area',
        lat: 28.693,
        lng: 76.935,
        mapsUrl: 'https://maps.google.com/?q=Bahadurgarh,Haryana',
        order: 9,
    },
    {
        city: 'Palwal Unit',
        slug: 'palwal',
        region: 'Haryana / NCR Zone',
        address: 'Palwal industrial area',
        lat: 28.149,
        lng: 77.332,
        mapsUrl: 'https://maps.google.com/?q=Palwal,Haryana',
        order: 10,
    },
].map((unit) => ({ ...unit, published: true }));

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error(
        'MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/seed-manufacturing-units.mjs'
    );
    process.exit(1);
}

try {
    for (const unit of units) {
        await new ManufacturingUnit(unit).validate();
    }

    await mongoose.connect(uri);
    const result = await ManufacturingUnit.bulkWrite(
        units.map((unit) => ({
            updateOne: {
                filter: { slug: unit.slug },
                update: { $set: unit },
                upsert: true,
            },
        }))
    );
    console.log(
        `Seeded manufacturing units: ${result.upsertedCount} created, ${result.modifiedCount} updated.`
    );
} catch (error) {
    console.error('Manufacturing unit seeding failed:', error);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
