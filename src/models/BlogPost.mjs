import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
        },
        excerpt: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            trim: true,
            default: 'Industry Insights',
            index: true,
        },
        readTime: {
            type: String,
            trim: true,
            default: '4 min read',
        },
        coverImage: {
            type: String,
            trim: true,
            default: '',
        },
        author: {
            type: String,
            trim: true,
            default: 'Rajasthanwalls Technical Desk',
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        published: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

BlogPostSchema.index({ published: 1, publishedAt: -1 });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

