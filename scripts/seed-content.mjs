import mongoose from 'mongoose';
import { blogPosts } from '../src/data/blogs.js';
import BlogPost from '../src/models/BlogPost.mjs';
import Testimonial from '../src/models/Testimonial.mjs';

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');

const testimonials = [
    {
        name: 'Rajesh Sharma', role: 'Site Manager, Industrial Park', location: 'Bhiwadi', rating: 5,
        quote: 'The precast RCC compound wall installation was fast and seamless. They completed 1,000 running feet in under 5 days, saving us significant labor costs compared to traditional brick masonry.',
    },
    {
        name: 'Vikram Singh', role: 'Commercial Plot Owner', location: 'Alwar', rating: 5,
        quote: 'Outstanding quality and alignment. The precast panels and posts are very sturdy, and the team ensured precise boundary demarcation without any material wastage on site.',
    },
    {
        name: 'Amit Patel', role: 'Civil Infrastructure Contractor', location: 'Gurugram', rating: 5,
        quote: 'We sourced both boundary walls and heavy-duty paver blocks for our logistics yard. Prompt delivery from their factory unit and excellent structural finishing.',
    },
];

try {
    await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
    for (const post of blogPosts) {
        await BlogPost.updateOne(
            { slug: post.slug },
            { $setOnInsert: {
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                category: post.category,
                readTime: post.readTime,
                coverImage: post.image,
                author: post.author || 'Rajasthanwalls Technical Desk',
                publishedAt: new Date(post.date),
                published: true,
            } },
            { upsert: true },
        );
    }
    for (const [order, testimonial] of testimonials.entries()) {
        await Testimonial.updateOne(
            { name: testimonial.name, quote: testimonial.quote },
            { $setOnInsert: { ...testimonial, order, published: true } },
            { upsert: true },
        );
    }
    console.log(`Imported ${blogPosts.length} legacy blog posts and ${testimonials.length} testimonials (existing records preserved).`);
} finally {
    await mongoose.disconnect();
}
