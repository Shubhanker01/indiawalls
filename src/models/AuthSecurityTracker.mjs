import mongoose from 'mongoose';

const AuthSecurityTrackerSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
        },
        passwordFailures: {
            type: Number,
            default: 0,
            min: 0,
        },
        mfaFailures: {
            type: Number,
            default: 0,
            min: 0,
        },
        isPasswordLocked: {
            type: Boolean,
            default: false,
            index: true,
        },
        isMfaLocked: {
            type: Boolean,
            default: false,
            index: true,
        },
        passwordResetToken: {
            type: String,
            default: null,
        },
        passwordResetExpires: {
            type: Date,
            default: null,
        },
        mfaOtpHash: {
            type: String,
            default: null,
        },
        mfaOtpExpires: {
            type: Date,
            default: null,
        },
        mfaOtpAttempts: {
            type: Number,
            default: 0,
            min: 0,
        },
        lastFailedAt: {
            type: Date,
            default: Date.now,
        },
        lockedAt: {
            type: Date,
            default: null,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.AuthSecurityTracker ||
    mongoose.model('AuthSecurityTracker', AuthSecurityTrackerSchema);

