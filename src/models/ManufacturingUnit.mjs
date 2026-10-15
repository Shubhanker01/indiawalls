import mongoose from 'mongoose';

const ManufacturingUnitSchema = new mongoose.Schema(
    {
        city: { type: String, required: true, trim: true },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
        },
        region: { type: String, trim: true, default: '' },
        address: { type: String, trim: true, default: '' },
        lat: { type: Number, required: false, min: -90, max: 90 },
        lng: { type: Number, required: false, min: -180, max: 180 },
        mapsUrl: { type: String, trim: true, default: '' },
        order: { type: Number, default: 0, index: true },
        published: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

ManufacturingUnitSchema.index({ published: 1, order: 1 });

const existingModel = mongoose.models.ManufacturingUnit;
if (
    existingModel &&
    (existingModel.schema.path('lat').isRequired || existingModel.schema.path('lng').isRequired)
) {
    mongoose.deleteModel('ManufacturingUnit');
}

export default mongoose.models.ManufacturingUnit ||
    mongoose.model('ManufacturingUnit', ManufacturingUnitSchema);
