/**
 * Verifies whether an authenticated Supabase user possesses administrative privileges.
 * Checks custom app_metadata (RBAC), user_metadata, and configured admin email allowlists.
 *
 * @param {object|null} user - The Supabase user object.
 * @returns {boolean} True if user is an authorized admin, false otherwise.
 */
export function verifyAdminRole(user) {
    if (!user || typeof user !== 'object') {
        return false;
    }

    // 1. Strict RBAC via Supabase app_metadata (assigned only by service role)
    if (user.app_metadata?.role === 'admin') {
        return true;
    }

    // 2. Custom role assigned in user_metadata
    if (user.user_metadata?.role === 'admin') {
        return true;
    }

    // 3. Email-based allowlist verification via environment variables
    const rawAllowlist = [
        process.env.ADMIN_EMAIL,
        process.env.ALLOWED_ADMIN_EMAILS,
    ]
        .filter(Boolean)
        .join(',');

    if (rawAllowlist && user.email) {
        const adminEmails = rawAllowlist
            .split(',')
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean);

        if (adminEmails.includes(user.email.toLowerCase())) {
            return true;
        }
    }

    return false;
}

/**
 * Validates uploaded image buffers by inspecting file magic bytes (file signature).
 * Defends against MIME-type spoofing, stored XSS, and executable payload embedding.
 *
 * @param {Buffer} buffer - Binary buffer of the uploaded file.
 * @param {string} declaredMimeType - Client-declared Content-Type header.
 * @returns {boolean} True if buffer magic bytes match an allowed image format, false otherwise.
 */
export function validateImageMagicBytes(buffer, declaredMimeType) {
    if (!Buffer.isBuffer(buffer) || buffer.length < 12) {
        return false;
    }

    const mime = (declaredMimeType || '').toLowerCase();

    // JPEG signature: FF D8 FF
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    if (isJpeg) {
        return mime === 'image/jpeg' || mime === 'image/jpg';
    }

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const isPng =
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a;
    if (isPng) {
        return mime === 'image/png';
    }

    // WebP signature: "RIFF" [4 bytes size] "WEBP"
    const isRiff =
        buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
    const isWebp =
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
    if (isRiff && isWebp) {
        return mime === 'image/webp';
    }

    return false;
}

