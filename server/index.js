const express = require('express');
const morgan = require('morgan');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.YT_API_KEY || process.env.YOUTUBE_API_KEY || '';

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// In-memory cache: { key: { value, expiry } }
const cache = new Map();
function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) { cache.delete(key); return null; }
  return item.value;
}
function setCache(key, value, ttlMs) {
  cache.set(key, { value, expiry: Date.now() + ttlMs });
}

async function ytGetLiveVideoId(channelId) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('channelId', channelId);
  url.searchParams.set('eventType', 'live');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('key', API_KEY);

  const res = await fetch(url.href);
  if (!res.ok) throw new Error(`YouTube API error ${res.status}`);
  const data = await res.json();
  const item = (data.items || [])[0];
  if (!item) return null;
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt,
  };
}

async function ytGetLatestVideo(channelId) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('channelId', channelId);
  url.searchParams.set('order', 'date');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('key', API_KEY);

  const res = await fetch(url.href);
  if (!res.ok) throw new Error(`YouTube API error ${res.status}`);
  const data = await res.json();
  const item = (data.items || [])[0];
  if (!item) return null;
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt,
    thumbnail: item.snippet.thumbnails && (item.snippet.thumbnails.high || item.snippet.thumbnails.medium || item.snippet.thumbnails.default).url,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Simple Readability proxy (fast, no headless browser) with safeguards
app.get('/api/extract', async (req, res) => {
  try {
    const url = String(req.query.url || '').trim();
    const token = String(req.headers['x-bl-token'] || '');
    if (!url) return res.status(400).json({ error: 'url required' });
    // Basic allowlist: only http(s)
    if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'invalid url' });
    // Optional lightweight auth
    if (process.env.BL_PROXY_TOKEN && token !== process.env.BL_PROXY_TOKEN) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const cacheKey = `extract:${url}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const r = await fetch(url, { headers: { 'User-Agent': 'BrightlensReader/1.0 (+https://philipkilonzoke.github.io)' }, signal: ctrl.signal });
    clearTimeout(timer);
    if (!r.ok) return res.status(502).json({ error: `fetch ${r.status}` });
    const html = await r.text();
    // Size guard
    if (html.length > 1_500_000) return res.status(413).json({ error: 'page too large' });
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    const text = (article?.textContent || '').trim();
    const title = (article?.title || dom.window.document.title || '').trim();
    // hash-like fingerprint (length + a few char codes)
    const sig = `${text.length}:${(text.charCodeAt(0)||0)}:${(text.charCodeAt(Math.floor(text.length/2))||0)}:${(text.charCodeAt(text.length-1)||0)}`;
    const payload = { ok: true, title, text, length: text.length, sig };
    setCache(cacheKey, payload, 12 * 60 * 60 * 1000);
    res.json(payload);
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/live', async (req, res) => {
  try {
    const channelId = String(req.query.channelId || '').trim();
    if (!channelId) return res.status(400).json({ error: 'channelId required' });
    if (!API_KEY) return res.status(500).json({ error: 'Server is not configured with YT_API_KEY' });

    const cacheKey = `live:${channelId}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const live = await ytGetLiveVideoId(channelId);
    if (live && live.videoId) {
      const payload = { status: 'live', ...live };
      setCache(cacheKey, payload, 30 * 1000); // 30s cache for live
      return res.json(payload);
    }

    const latest = await ytGetLatestVideo(channelId);
    const payload = { status: 'offline', latest };
    setCache(cacheKey, payload, 5 * 60 * 1000); // 5m cache for offline
    return res.json(payload);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: 'error', error: e.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Live API running on :${PORT}`);
  });
}

module.exports = app;