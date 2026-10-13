const allowedTags = new Set([
    'p', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li',
    'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'br', 'hr',
]);

// Blog content is authored by admins. Keep a small formatting allowlist and drop
// every attribute so event handlers, inline styles, and javascript URLs cannot run.
export function sanitizeHtml(input = '') {
    return String(input)
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<(script|style|iframe|object|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
        .replace(/<\/?([a-z0-9-]+)\b[^>]*>/gi, (tag, name) => {
            const lower = name.toLowerCase();
            if (!allowedTags.has(lower)) return '';
            return /^<\//.test(tag) ? `</${lower}>` : `<${lower}>`;
        });
}
