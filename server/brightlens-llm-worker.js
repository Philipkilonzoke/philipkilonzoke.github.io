// Cloudflare Worker: Brightlens AI LLM proxy (free-tier friendly)
// Usage: Deploy on Cloudflare Workers and set environment variable HF_TOKEN (Hugging Face Inference API token, free tier)
// Endpoint: POST /summarize { text: string, max_sentences?: number }

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors() });
    }

    if (url.pathname === '/summarize' && request.method === 'POST') {
      try {
        const body = await request.json();
        const text = (body?.text || '').toString().slice(0, 20000); // limit
        const maxSentences = Math.min(Math.max(Number(body?.max_sentences || 10), 3), 20);
        if (!text) return json({ error: 'missing text' }, 400);

        const hfToken = env.HF_TOKEN;
        if (!hfToken) return json({ error: 'server not configured' }, 500);

        // Prefer a small, fast summarization model
        const model = 'sshleifer/distilbart-cnn-12-6';
        const res = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: text, parameters: { max_length: 220, min_length: 80, do_sample: false } })
        });
        if (!res.ok) {
          const msg = await res.text();
          return json({ error: 'hf_error', detail: msg }, 502);
        }
        const data = await res.json();
        let summary = '';
        if (Array.isArray(data) && data[0]?.summary_text) summary = data[0].summary_text;
        else if (data?.summary_text) summary = data.summary_text;
        else summary = '';

        if (!summary) return json({ error: 'no_summary' }, 502);
        return json({ summary }, 200);
      } catch (e) {
        return json({ error: 'bad_request', detail: e?.message || String(e) }, 400);
      }
    }

    return json({ ok: true }, 200);
  }
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...cors() } });
}

