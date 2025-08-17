const express = require('express');
const morgan = require('morgan');
const fetch = require('node-fetch');
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

// Simple RSS proxy endpoint
app.get('/api/rss', async (req, res) => {
  try {
    const url = String(req.query.url || '').trim();
    if (!url) return res.status(400).json({ error: 'url required' });

    const cacheKey = `rss:${url}`;
    const cached = getCache(cacheKey);
    if (cached) return res.type('application/xml').send(cached);

    const upstream = await fetch(url, { headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' } });
    if (!upstream.ok) return res.status(upstream.status).json({ error: `Upstream ${upstream.status}` });
    const text = await upstream.text();
    setCache(cacheKey, text, 60 * 1000); // 60s cache
    return res.type('application/xml').send(text);
  } catch (e) {
    console.error('RSS proxy error:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// Generic JSON proxy for APIs with limited headers
app.get('/api/json', async (req, res) => {
  try {
    const url = String(req.query.url || '').trim();
    if (!url) return res.status(400).json({ error: 'url required' });

    const cacheKey = `json:${url}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const upstream = await fetch(url, { headers: { 'Accept': 'application/json, */*' } });
    if (!upstream.ok) return res.status(upstream.status).json({ error: `Upstream ${upstream.status}` });
    const data = await upstream.json();
    setCache(cacheKey, data, 60 * 1000);
    return res.json(data);
  } catch (e) {
    console.error('JSON proxy error:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Live API running on :${PORT}`);
  });
}

module.exports = app;