import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Customer name is required.'],
            trim: true,
            maxlength: 120,
        },
        phone: {
            type: String,
            required: [true, 'Mobile number is required.'],
            trim: true,
            maxlength: 30,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            maxlength: 254,
            default: '',
        },
        productCategory: {
            type: String,
            trim: true,
            default: 'Precast Boundary Wall',
        },
        lengthFeet: {
            type: Number,
            min: 0,
            default: null,
        },
        heightFeet: {
            type: Number,
            min: 0,
            default: null,
        },
        location: {
            type: String,
            trim: true,
            default: '',
        },
        message: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: '',
        },
        status: {
            type: String,
            enum: ['new', 'contacted', 'closed'],
            default: 'new',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

InquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

