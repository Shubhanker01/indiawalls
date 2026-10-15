import mongoose from 'mongoose';

const SpecificationItemSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const SpecificationSchema = new mongoose.Schema(
    {
        specificationName: { type: String, required: true, trim: true },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
        },
        label: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        specifications: { type: [SpecificationItemSchema], default: [] },
        image: { type: String, required: true, trim: true },
        published: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

export default mongoose.models.Specification ||
    mongoose.model('Specification', SpecificationSchema);
