import mongoose from 'mongoose';

const SiteSettingSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            default: '+91 9950711475',
            trim: true,
        },
        email: {
            type: String,
            default: 'info@rajasthanwalls.in',
            trim: true,
            lowercase: true,
        },
        address: {
            type: String,
            default: 'C-7 Shri Hari Laxmi Tower, Bhagat Singh Circle, Alwar, Rajasthan 301001',
            trim: true,
        },
        stats: {
            runningFeet: { type: String, default: '10,00,000+' },
            completedProjects: { type: String, default: '500+' },
            factoryUnits: { type: String, default: '5+' },
            satisfactionRate: { type: String, default: '99%' },
        },
        announcement: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);

