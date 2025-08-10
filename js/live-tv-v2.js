// Live TV page logic for Brightlens
// - Renders a grid of channels
// - Search filter
// - On-demand loading of YouTube iframe when user clicks "Watch Live"
// - Calls backend API to fetch current live videoId, with localStorage caching
// - Graceful offline fallback to latest video

(function () {
  const API_BASE_URL = window.BRIGHTLENS_API_BASE_URL || '/api';
  const CACHE_TTL_MS_LIVE = 60 * 1000; // 1 minute for live checks
  const CACHE_TTL_MS_OFFLINE = 10 * 60 * 1000; // 10 minutes for offline

  const channels = [
    // International News
    { key: 'cnn', name: 'CNN', channelId: 'UCupvZG-5ko_eiXAupbDfxWw', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg', description: 'Major US-based 24-hour news channel covering breaking news, politics, world events, and special live reports.' },
    { key: 'bbc-news', name: 'BBC News', channelId: 'UC16niRr50-MSBwiO3YDb3RA', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/BBC_News_2022_%28Alt%29.svg', description: 'British Broadcasting Corporation’s news channel offering international news with UK and global perspectives.' },
    { key: 'aljazeera', name: 'Al Jazeera English', channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Aljazeera_Logo.svg', description: 'International news channel headquartered in Qatar focusing on Middle East and global South perspectives.' },
    { key: 'sky-news', name: 'Sky News', channelId: 'UCeY0bbntWzzVIaj2z3QigXg', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Sky-news-logo.png', description: 'UK-based 24-hour news channel providing rolling news coverage and live event reporting.' },
    { key: 'weather-channel', name: 'The Weather Channel', channelId: 'UCl3yX2d_j8B5x87jMKxm9Ow', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/The_Weather_Channel_logo_2005-present.svg', description: 'US channel specializing in weather forecasts, alerts, and live storm coverage.' },
    { key: 'france24', name: 'France 24 English', channelId: 'UCtI0Hodo5o5dUb67FeUjDeA', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/France24.svg', description: 'French international news network broadcasting worldwide in English with a focus on French affairs.' },
    { key: 'dw-news', name: 'DW News', channelId: 'UCW39zufHfsuGgpLviKh297Q', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Deutsche_Welle_symbol_2012.svg', description: 'Deutsche Welle, Germany’s international broadcaster in English, focused on European and global news.' },
    { key: 'abc-news', name: 'ABC News', channelId: 'UCZzFHmANk9Xq9XbEdj9drQA', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/ABC_News_logo.svg', description: 'American Broadcasting Company’s news division offering US news and live reports.' },
    { key: 'reuters', name: 'Reuters', channelId: 'UC0H1p02dfc27kERQo3ZRlNA', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Reuters_Logo.svg', description: 'International news agency offering unbiased news and financial coverage.' },
    { key: 'bloomberg-qt', name: 'Bloomberg Quicktake', channelId: 'UClfK8Jf6Dv9tC2i2N7dHgag', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Bloomberg_logo.svg', description: 'Business and financial news channel providing live market data and analysis.' },
    { key: 'cbs-news', name: 'CBS News', channelId: 'UCupvZG-5ko_eiXAupbDfxWw', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/CBS_News_logo_%282020%29.svg', description: 'Major US broadcast network delivering news and live events.' },
    { key: 'npr', name: 'NPR', channelId: 'UCyqQ2Ku0tm5d_XpRjwY8qHQ', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/db/NPR_logo.svg', description: 'National Public Radio from the US, known for in-depth news and public affairs.' },
    { key: 'fox-news', name: 'Fox News', channelId: 'UCXIJgqnII2ZOINSWNOGFThA', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Fox_News_Channel_logo.svg', description: 'US cable news channel with a conservative viewpoint covering live news and political commentary.' },
    { key: 'india-today', name: 'India Today', channelId: 'UCu9fF7P4LvqG5y8yNgCHb2A', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/India_Today_logo.svg', description: 'Leading Indian news channel with live coverage and current affairs.' },
    { key: 'nhk-world', name: 'NHK WORLD-JAPAN', channelId: 'UCQIJ5s-t-ED_z1qL-2p_r1A', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/NHK_World-Japan_logo.svg', description: "English-language news service of Japan's public broadcaster." },
    { key: 'cbc-news', name: 'CBC News', channelId: 'UCD7dJjOIv4pSK80NZXKRsLQ', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/CBC_News_Logo.svg', description: 'Canada’s national public broadcaster news channel.' },
    { key: 'trt-world', name: 'TRT World', channelId: 'UCXIJgqnII2ZOINSWNOGFThA', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/TRT_World_logo.svg', description: 'Turkish international news channel broadcasting in English.' },
    { key: 'euronews', name: 'Euronews (English)', channelId: 'UCuUWoB7n8E92zCJKYpTOivg', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Euronews_2016_logo.svg', description: 'European multilingual news network providing live news streams.' },
    { key: 'cspan', name: 'C-SPAN', channelId: 'UCcjpSM_5i7opUwdZ0OZDs5w', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/C-SPAN_logo.svg', description: 'US public service broadcaster covering government proceedings live.' },
    { key: 'nasa', name: 'NASA Live', channelId: 'UCLA_DiR1FfKNvjuUpBHmylQ', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg', description: "US space agency's official live channel streaming launches and space missions." },
    { key: 'citizen-tv-ke', name: 'Citizen TV Kenya', channelId: 'UChBQgieUidXV1CmDxSdRm3g', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Citizen_TV_Logo.png', description: 'Popular Kenyan TV channel offering local news, entertainment, and live events.' },
    { key: 'ntv-kenya', name: 'NTV Kenya', channelId: 'UCqBJ47FjJcl61fmSbcadAVg', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/NTV_Kenya_logo.png', description: 'Leading Kenyan TV station focusing on news, politics, and entertainment.' }
  ];

  const state = {
    filtered: channels,
    page: 1,
    pageSize: 12,
  };

  function $(sel) { return document.querySelector(sel); }

  function cacheKey(channelId) { return `live_cache_${channelId}`; }

  function getCached(channelId) {
    try {
      const raw = localStorage.getItem(cacheKey(channelId));
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.expiry) return null;
      if (Date.now() > data.expiry) return null;
      return data.value;
    } catch { return null; }
  }

  function setCached(channelId, value, ttlMs) {
    try {
      const payload = { value, expiry: Date.now() + ttlMs };
      localStorage.setItem(cacheKey(channelId), JSON.stringify(payload));
    } catch {}
  }

  async function fetchLiveInfo(channelId) {
    const cached = getCached(channelId);
    if (cached) return cached;

    try {
      const resp = await fetch(`${API_BASE_URL}/live?channelId=${encodeURIComponent(channelId)}`, { credentials: 'omit' });
      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const data = await resp.json();

      const ttl = data.status === 'live' ? CACHE_TTL_MS_LIVE : CACHE_TTL_MS_OFFLINE;
      setCached(channelId, data, ttl);
      return data;
    } catch (e) {
      return { status: 'error', error: e.message };
    }
  }

  function renderGrid() {
    const grid = $('#channels-grid');
    if (!grid) return;

    const start = 0;
    const end = state.page * state.pageSize;
    const list = state.filtered.slice(start, end);

    grid.innerHTML = list.map(ch => `
      <div class="channel-card">
        <div class="channel-card-header">
          <img class="channel-logo" src="${ch.logo}" alt="${ch.name} logo" loading="lazy" referrerpolicy="no-referrer" />
          <div class="channel-meta">
            <h3>${ch.name}</h3>
            <p>${ch.description}</p>
          </div>
        </div>
        <div class="channel-card-actions">
          <button class="watch-btn" data-channel-id="${ch.channelId}" data-name="${ch.name}">Watch Live</button>
        </div>
      </div>
    `).join('');

    const loadMore = $('#load-more');
    if (loadMore) {
      loadMore.style.display = state.filtered.length > end ? 'block' : 'none';
    }

    bindWatchButtons();
  }

  function bindWatchButtons() {
    document.querySelectorAll('.watch-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const channelId = e.currentTarget.getAttribute('data-channel-id');
        const name = e.currentTarget.getAttribute('data-name');
        openPlayerOverlay();
        setOverlayTitle(name);
        setOverlayLoading(true);

        const info = await fetchLiveInfo(channelId);
        if (info.status === 'live' && info.videoId) {
          mountYouTubePlayer(info.videoId);
          setOverlayLoading(false);
          setOverlayMeta(info);
        } else if (info.status === 'offline' && info.latest && info.latest.videoId) {
          showOfflineMessage();
          showLatestVideo(info.latest);
          setOverlayLoading(false);
        } else {
          showErrorMessage(info.error || 'Unable to load stream.');
          setOverlayLoading(false);
        }
      });
    });
  }

  function openPlayerOverlay() {
    $('#player-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePlayerOverlay() {
    $('#player-overlay').classList.remove('active');
    document.body.style.overflow = '';
    const container = $('#player-container');
    container.innerHTML = '';
    $('#player-meta').innerHTML = '';
    $('#player-status').innerHTML = '';
  }

  function setOverlayTitle(text) {
    $('#player-title').textContent = text;
  }

  function setOverlayLoading(isLoading) {
    $('#player-loading').style.display = isLoading ? 'flex' : 'none';
  }

  function setOverlayMeta(info) {
    const meta = $('#player-meta');
    const title = info.title ? `<div class="meta-row"><strong>Title:</strong> ${escapeHtml(info.title)}</div>` : '';
    const when = info.publishedAt ? `<div class="meta-row"><strong>Started:</strong> ${new Date(info.publishedAt).toLocaleString()}</div>` : '';
    meta.innerHTML = `${title}${when}`;
  }

  function mountYouTubePlayer(videoId) {
    const container = $('#player-container');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
    iframe.title = 'YouTube video player';
    iframe.loading = 'eager';
    iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-presentation');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    container.innerHTML = '';
    container.appendChild(iframe);
  }

  function showOfflineMessage() {
    $('#player-status').innerHTML = '<div class="offline">Currently offline</div>';
  }

  function showLatestVideo(latest) {
    const meta = $('#player-meta');
    const thumb = latest.thumbnail || '';
    const title = latest.title || 'Latest upload';
    const url = `https://www.youtube.com/watch?v=${encodeURIComponent(latest.videoId)}`;
    meta.innerHTML += `
      <a class="latest" href="${url}" target="_blank" rel="noopener noreferrer">
        <img src="${thumb}" alt="Latest video thumbnail"/>
        <span>${escapeHtml(title)}</span>
      </a>
    `;
  }

  function showErrorMessage(msg) {
    $('#player-status').innerHTML = `<div class="error">${escapeHtml(msg)}</div>`;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]_/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','_':'&#95;'}[s]));
  }

  function bindSearch() {
    const input = $('#channel-search');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      state.page = 1;
      state.filtered = channels.filter(ch => ch.name.toLowerCase().includes(q));
      renderGrid();
    });
  }

  function bindLoadMore() {
    const btn = $('#load-more');
    if (!btn) return;
    btn.addEventListener('click', () => {
      state.page += 1;
      renderGrid();
    });
  }

  function bindOverlayControls() {
    $('#player-close').addEventListener('click', closePlayerOverlay);
    $('#back-to-list').addEventListener('click', closePlayerOverlay);
    $('#player-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'player-overlay') closePlayerOverlay();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePlayerOverlay();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindSearch();
    bindLoadMore();
    bindOverlayControls();
    renderGrid();
  });
})();