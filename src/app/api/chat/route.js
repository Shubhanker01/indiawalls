import { apiResponse } from '@/lib/api/response';
// app/api/chat/route.js
export async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch {
        return apiResponse({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const { query, session_id } = body || {};

    // 1. Input validation & length limits
    if (!query || typeof query !== 'string' || query.trim().length === 0 || query.length > 2000) {
        return apiResponse({ error: 'Query must be a non-empty string under 2000 characters.' }, { status: 400 });
    }

    // 2. Sanitize session_id to prevent injection and DoS
    const sanitizedSessionId =
        typeof session_id === 'string'
            ? session_id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
            : `web_${Date.now()}`;

    // 3. Resolve base URL correctly (preventing truthy undefined/api/query strings)
    const rawBaseUrl = process.env.RAG_API_URL || process.env.RAG_API_FALLBACK_URL;
    const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, '') : null;

    if (!baseUrl) {
        return apiResponse({
            answer: 'Thank you for reaching out to RajasthanWalls! Our technical assistant is currently operating in offline mode. Please call our sales team directly at +91 9950711475 or message us on WhatsApp (+91 7820879777) for an immediate quote.',
        });
    }

    const targetUrl = `${baseUrl}/api/query`;

    try {
        const upstreamResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query.trim(),
                session_id: sanitizedSessionId,
            }),
            signal: AbortSignal.timeout(15000), // 15-second request timeout
        });

        if (!upstreamResponse.ok) {
            console.error(`RAG API upstream responded with status ${upstreamResponse.status}`);
            return apiResponse({
                answer: 'Hamara AI assistant abhi busy hai. Precast boundary wall aur RCC quotes ke liye kripya hamari sales team ko +91 9950711475 par call karein.',
            });
        }

        const data = await upstreamResponse.json();
        return apiResponse({ answer: data.answer || 'Thank you for your inquiry.' });
    } catch (err) {
        console.error('RAG assistant proxy request failed:', err.message);
        return apiResponse({
            answer: 'Maaf kijiye, abhi connect karne mein samasya aa rahi hai. Kripya thodi der baad prayas karein ya hamare WhatsApp (+91 7820879777) par contact karein.',
        });
    }
}