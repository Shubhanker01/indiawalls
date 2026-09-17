// app/api/chat/route.js
export async function POST(req) {
    const { query, session_id } = await req.json();

    // Basic validation
    if (!query || typeof query !== "string" || query.length > 2000) {
        return Response.json({ error: "Invalid query" }, { status: 400 });
    }

    const res = await fetch(`${process.env.RAG_API_URL}/api/query` || `${process.env.RAG_API_FALLBACK_URL}/api/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, session_id }),
    });
    const data = await res.json();
    return Response.json({ answer: data.answer });
}