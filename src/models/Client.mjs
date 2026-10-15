import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
        },
        logo: { type: String, required: true, trim: true },
        order: { type: Number, default: 0, index: true },
        published: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

ClientSchema.index({ published: 1, order: 1 });

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
