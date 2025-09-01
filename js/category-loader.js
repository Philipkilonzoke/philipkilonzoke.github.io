// Shared Category Loader - minimal, fast, and resilient
// Exposes: window.loadCategoryNews({ category, feeds, freshnessHours=48, maxItems=50, cacheTtlMinutes=60 })

(function(){
  function formatDate(value){
    try{
      const date = new Date(value);
      const now = new Date();
      const seconds = (now - date) / 1000;
      if (seconds < 60) return 'Just now';
      if (seconds < 3600) return Math.floor(seconds/60) + 'm ago';
      if (seconds < 86400) return Math.floor(seconds/3600) + 'h ago';
      return date.toLocaleString();
    }catch(e){ return 'Unknown date'; }
  }

  // Normalize and proxy image URLs for reliability and HTTPS safety
  function normalizeImageUrl(rawUrl){
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    let url = rawUrl.trim();
    // Handle protocol-relative URLs
    if (url.startsWith('//')) url = 'https:' + url;
    // Some feeds HTML-encode ampersands
    url = url.replace(/&amp;/g, '&');
    // Prefer proxying via weserv for speed/caching/https safety
    try{
      const u = new URL(url);
      const host = u.hostname.replace('www.','');
      if (host === 'images.weserv.nl' || host === 's.wordpress.com') return url;
      return toProxiedUrl(url);
    }catch(_){
      // If it's missing scheme but looks like a domain/path, attempt https
      if (/^[a-z0-9.-]+\//i.test(url)) return 'https://' + url;
      return '';
    }
  }

  function toProxiedUrl(rawUrl){
    try{
      const u = new URL(rawUrl);
      // images.weserv.nl expects the URL without scheme in the url param
      const withoutScheme = u.href.replace(/^https?:\/\//i, '');
      return 'https://images.weserv.nl/?url=' + encodeURIComponent(withoutScheme);
    }catch(_){
      return rawUrl;
    }
  }

  function mshotForArticle(articleUrl){
    if (!articleUrl) return '';
    return 'https://s.wordpress.com/mshots/v1/' + encodeURIComponent(articleUrl) + '?w=1920';
  }

  // Global, resilient onerror handler that attempts proxy and then page screenshot
  window.blImgErrorHandler = function(imgEl){
    try{
      const step = Number(imgEl.getAttribute('data-fallback-step') || '0');
      const original = imgEl.getAttribute('data-original') || imgEl.getAttribute('data-src') || imgEl.src;
      const articleUrl = imgEl.getAttribute('data-article-url') || '';

      if (step === 0 && original){
        // Try weserv proxy
        imgEl.setAttribute('data-fallback-step', '1');
        imgEl.src = toProxiedUrl(original);
        return;
      }

      if (step === 1 && articleUrl){
        // Try mshots screenshot of the article page
        imgEl.setAttribute('data-fallback-step', '2');
        imgEl.src = mshotForArticle(articleUrl);
        return;
      }

      // Final fallback: replace with text placeholder
      if (imgEl.parentElement){
        imgEl.parentElement.innerHTML = '<div class="text-placeholder">Brightlens News</div>';
      }
    }catch(_){
      if (imgEl && imgEl.parentElement){
        imgEl.parentElement.innerHTML = '<div class="text-placeholder">Brightlens News</div>';
      }
    }
  };

  // Onload handler: if mShots placeholder likely returned, refresh once to fetch real screenshot
  window.blImgLoadHandler = function(imgEl){
    try{
      const src = imgEl && imgEl.currentSrc || imgEl && imgEl.src || '';
      if (!src || imgEl.getAttribute('data-mshot-reloaded') === '1') return;
      if (/s\.wordpress\.com\/mshots\/v1\//i.test(src)){
        imgEl.setAttribute('data-mshot-reloaded', '1');
        setTimeout(()=>{
          try{
            const bust = (src.indexOf('?')>=0 ? '&' : '?') + 'r=' + Date.now();
            imgEl.src = src + bust;
          }catch(_){ /* noop */ }
        }, 1500);
      }
    }catch(_){ /* noop */ }
  };

  function extractImage(item){
    const candidates = [
      item.image,
      item.image_url,
      item.cover,
      item.picture,
      item.enclosure?.url,
      item.enclosure?.link,
      Array.isArray(item.enclosures) && item.enclosures.length ? item.enclosures[0]?.url : null,
      item.media?.content?.url,
      item['media:content']?.url,
      item['media:thumbnail']?.url,
      item.thumbnail
    ].filter(Boolean);
    for (const url of candidates){
      if (typeof url === 'string' && /^https?:\/\//.test(url)){
        try{
          const u = new URL(url);
          const host = u.hostname.replace('www.','');
          const pathLower = u.pathname.toLowerCase();
          // Avoid common logo/default placeholders (e.g., bleepingcomputer logos)
          if (pathLower.includes('logo') || pathLower.includes('default') || pathLower.endsWith('.svg')){
            continue;
          }
          return url;
        }catch(_){ return url; }
      }
    }
    const html = item.content || item['content:encoded'] || item.content_html || item.description || '';
    const m = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (m && /^https?:\/\//.test(m[1])) return m[1];
    const articleUrl = item.link || item.url;
    if (articleUrl) return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(articleUrl)}?w=1280`;
    return '';
  }

  function dedupe(items){
    const seen = new Set();
    const out = [];
    for(const it of items){
      const key = (it.link || it.url || it.guid || it.title || '').trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(it);
    }
    return out;
  }

  function fetchWithTimeout(resource, options = {}){
    const { timeoutMs = 3000 } = options;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), timeoutMs);
      fetch(resource, options).then(res => { clearTimeout(timer); resolve(res); }).catch(err => { clearTimeout(timer); reject(err); });
    });
  }

  async function parseViaAllOrigins(url){
    const res = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { timeoutMs: 4000 });
    if (!res.ok) throw new Error('proxy');
    const data = await res.json();
    const xml = data.contents || '';
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const nodes = Array.from(doc.querySelectorAll('item, entry'));
    return nodes.map(el => {
      const txt = q => { const n = el.querySelector(q); return n ? (n.textContent || '').trim() : ''; };
      let link = '';
      const l = el.querySelector('link');
      if (l) link = l.getAttribute('href') || (l.textContent || '').trim();
      const guidNode = el.querySelector('guid');
      const guid = guidNode ? (guidNode.textContent || '').trim() : '';
      let enc = '';
      const en = el.querySelector('enclosure'); if (en && en.getAttribute('url')) enc = en.getAttribute('url');
      const mc = el.getElementsByTagName('media:content')[0] || el.getElementsByTagName('media\\:content')[0]; if (!enc && mc && mc.getAttribute('url')) enc = mc.getAttribute('url');
      const mt = el.getElementsByTagName('media:thumbnail')[0] || el.getElementsByTagName('media\\:thumbnail')[0]; const thumb = (mt && mt.getAttribute('url')) || '';
      const desc = txt('description') || txt('summary') || txt('content') || txt('content:encoded');
      return { title: txt('title'), link, url: link, guid, description: desc, content: desc, pubDate: txt('pubDate') || txt('updated') || txt('published') || '', enclosure: { url: enc }, thumbnail: thumb };
    });
  }

  async function parseViaRss2Json(url){
    const r = await fetchWithTimeout('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url), { timeoutMs: 4000 });
    if (!r.ok) throw new Error('feed');
    const j = await r.json();
    return j.items || [];
  }

  async function fetchFeed(url){
    const raceParsers = [
      (async()=>{ try{ return await parseViaAllOrigins(url); }catch(_){ return null; } })(),
      (async()=>{ try{ return await parseViaRss2Json(url); }catch(_){ return null; } })()
    ];
    try{
      const winner = await Promise.race(raceParsers);
      if (Array.isArray(winner)) return winner;
      const settled = await Promise.allSettled(raceParsers);
      for (const r of settled){ if (r.status === 'fulfilled' && Array.isArray(r.value)) return r.value; }
    }catch(_){ /* noop */ }
    try{ return await parseViaAllOrigins(url); }catch(_){ try{ return await parseViaRss2Json(url); }catch(_){ return []; } }
  }

  function lazyLoad(){
    const imgs = document.querySelectorAll('.lazy-image');
    if ('IntersectionObserver' in window){
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting){
            const im = en.target;
            im.src = im.dataset.src;
            im.classList.remove('lazy-image');
            io.unobserve(im);
          }
        });
      }, { root: null, rootMargin: '250px 0px', threshold: 0.01 });
      imgs.forEach(im => io.observe(im));
    } else {
      imgs.forEach(im => { im.src = im.dataset.src; im.classList.remove('lazy-image'); });
    }
  }

  function hideSplash(){
    const scr = document.getElementById('loading-screen');
    if (scr){ scr.classList.add('hidden'); setTimeout(()=>{ scr.style.display='none'; }, 300); }
  }

  // Ensure splash hides only once per page load
  let __bl_splashHidden = false;
  function maybeHideSplash(){
    if (__bl_splashHidden) return;
    __bl_splashHidden = true;
    hideSplash();
  }

  function preconnect(host){
    try{
      const l = document.createElement('link');
      l.rel = 'preconnect';
      l.href = host;
      l.crossOrigin = '';
      document.head.appendChild(l);
    }catch(_){ /* noop */ }
  }

  function renderItems(category, items, maxItems){
    const load = document.getElementById('news-loading');
    const grid = document.getElementById('news-grid');
    const count = document.getElementById('article-count');
    const upd = document.getElementById('last-updated');
    const more = document.querySelector('.load-more-container');
    if (load) load.style.display = 'none';
    if (grid) grid.style.display = 'grid';

    const limited = items.slice(0, maxItems);
    if (count) count.textContent = `Showing ${Math.min(limited.length, items.length)} of ${items.length} articles`;
    if (upd) upd.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

      // Boost eager-loading for broad set of categories
  const boostedSet = new Set([
      'ai & ml','ai and ml','ai','climate','fact-check','science','cybersecurity','markets','mobility','gaming','africa','energy','spaceflight','real estate','real-estate','agriculture','personal finance','personal-finance','politics','travel','startups','quantum','robotics','ar/vr','ar-vr','smart home & iot','smart-home','iot','biotech','defense','maritime','logistics','e-commerce','ecommerce','cloud','cloud & saas','dev & oss','dev-open-source'
    ]);
    const catKey = (category || '').toString().toLowerCase();
    const boosted = boostedSet.has(catKey) || boostedSet.has(catKey.replace(/\s+/g,'-'));

    grid.innerHTML = limited.map(item => {
      const title = item.title || 'Untitled';
      const url = item.link || item.url || '#';
      const desc = (item.description || '').replace(/<[^>]+>/g,'');
      const rawImg = extractImage(item);
      const img = normalizeImageUrl(rawImg);
      const hasImg = img && /^https?:\/\//.test(img);
      const safeTitle = title.replace(/'/g, "\\'");
      const sizeAttrs = boosted ? ' width="600" height="400"' : '';
      const hiResSet = new Set(['science','africa','energy','technology','spaceflight','ai','ai & ml','quantum','robotics','ar/vr','ar-vr','iot','europe','north-america','latin-america','asia-pacific','mena']);
      const isHiRes = hiResSet.has((category||'').toString().toLowerCase());
      const prox = hasImg ? toProxiedUrl(img) : '';
      const srcset = isHiRes && hasImg ? ` srcset="${prox}&w=400 400w, ${prox}&w=800 800w, ${prox}&w=1200 1200w" sizes="(max-width: 480px) 400px, (max-width: 768px) 800px, 1200px"` : '';
      const imgSec = hasImg
        ? `<div class="news-image"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+" data-src="${img}" data-original="${rawImg || ''}" data-article-url="${url}" alt="${safeTitle}" loading="lazy" decoding="async"${sizeAttrs}${srcset} class="lazy-image" onerror="window.blImgErrorHandler(this)" onload="window.blImgLoadHandler(this)"></div>`
        : `<div class="text-placeholder">Brightlens News</div>`;
      return `<article class="news-card">${imgSec}<div class="news-content"><h3 class="news-title">${title}</h3><p class="news-description">${desc}</p><div class="news-meta"><span class="news-date">${formatDate(item.pubDate || item.published || Date.now())}</span><span class="news-category">${category}</span></div><div class="news-actions"><a href="${url}" target="_blank" rel="noopener noreferrer" class="news-link">Read More <i class="fas fa-external-link-alt"></i></a><div class="share-buttons"><button class="share-btn" title="WhatsApp" onclick="window.open('https://api.whatsapp.com/send?text='+encodeURIComponent('${safeTitle} '+ '${url}'),'_blank')"><i class="fab fa-whatsapp"></i></button><button class="share-btn" title="Facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('${url}'),'_blank')"><i class="fab fa-facebook-f"></i></button><button class="share-btn" title="Telegram" onclick="window.open('https://t.me/share/url?url='+encodeURIComponent('${url}')+'&text='+encodeURIComponent('${safeTitle}'),'_blank')"><i class="fab fa-telegram"></i></button><button class="share-btn" title="Twitter" onclick="window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('${safeTitle}')+'&url='+encodeURIComponent('${url}'),'_blank')"><i class="fab fa-twitter"></i></button><button class="share-btn" title="Copy Link" onclick="(async()=>{try{await navigator.clipboard.writeText('${safeTitle} '+ '${url}'); alert('Link copied');}catch(e){prompt('Copy link:', '${url}')}})()"><i class="fas fa-link"></i></button></div></div></div></article>`;
    }).join('');

    // Eagerly load the first few images for all categories (more for boosted)
    try{
      const eagerCount = boosted ? 8 : 4;
      const imgs = grid.querySelectorAll('img.lazy-image');
      for (let i = 0; i < Math.min(eagerCount, imgs.length); i++){
        const im = imgs[i];
        im.setAttribute('fetchpriority', i < 2 ? 'high' : 'auto');
        if (im.dataset && im.dataset.src){
          im.src = im.dataset.src;
          im.classList.remove('lazy-image');
        }
      }
    }catch(_){ /* no-op */ }

    if (more) more.style.display = (items.length > maxItems) ? 'block' : 'none';
    lazyLoad();
    // Do not hide the full-page splash here; it should hide only after the
    // first successful NETWORK render (or on fallback/error paths).
  }

  function showError(){
    const load = document.getElementById('news-loading');
    const err = document.getElementById('news-error');
    if (load) load.style.display = 'none';
    if (err) err.style.display = 'block';
    // Always hide the full-screen splash overlay on error so users aren't stuck
    hideSplash();
  }

  function getCache(key){
    try{
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.items || !data.ts) return null;
      return data;
    }catch(_){ return null; }
  }

  function setCache(key, items){
    try{
      const data = { ts: Date.now(), items };
      localStorage.setItem(key, JSON.stringify(data));
    }catch(_){ /* ignore quota errors */ }
  }

  window.loadCategoryNews = async function({ category, feeds, freshnessHours = 48, maxItems = 50, cacheTtlMinutes = 60, staleCutoffHours = 336, priorityCount = 4, minItemsGoal = 12 }){
    const retry = document.getElementById('retry-button');
    if (retry) retry.addEventListener('click', () => window.location.reload());

    const cacheKey = 'bl_cache_' + (category || 'general').toLowerCase().replace(/\s+/g, '-');
    const freshnessMs = freshnessHours * 60 * 60 * 1000;
    const cacheTtlMs = cacheTtlMinutes * 60 * 1000;

    try{
      // Preconnect to proxies
      preconnect('https://api.allorigins.win');
      preconnect('https://api.rss2json.com');
      // Preconnect to image helpers for faster image loads
      preconnect('https://images.weserv.nl');
      preconnect('https://s.wordpress.com');

      // Cache-first render for instant content (but keep splash until we render real items)
      const cachedInitial = getCache(cacheKey);
      let renderedOnce = false;
      if (cachedInitial && Array.isArray(cachedInitial.items) && cachedInitial.items.length){
        // Render cached content quickly for perceived performance, but keep
        // the splash visible until we perform a network render of fresh items.
        renderItems(category, cachedInitial.items, maxItems);
        renderedOnce = true;
      }

      // Progressive fetch: render as soon as we have enough items; then finalize at the end
      let accumulated = [];
      let lastRender = 0;
      const minItemsToReveal = 4; // reveal sooner for faster first paint
      const debounceMs = 250;

      async function processBatch(batch){
        return Promise.allSettled(batch.map(async (u)=>{
          const items = await fetchFeed(u);
          if (!Array.isArray(items) || items.length === 0) return;
          accumulated = dedupe(accumulated.concat(items));
          const nowTs = Date.now();
          if ((accumulated.length >= minItemsToReveal || !renderedOnce) && nowTs - lastRender > debounceMs){
            const now = Date.now();
            const fresh = accumulated.filter(it=>{
              const t = new Date(it.pubDate || it.published || it.isoDate || Date.now()).getTime();
              return (now - t) <= freshnessMs;
            });
            const base = (fresh.length ? fresh : accumulated).sort((a,b)=> new Date(b.pubDate||b.published||0) - new Date(a.pubDate||a.published||0));
            renderItems(category, base, maxItems);
            renderedOnce = true;
            lastRender = nowTs;
            // Hide splash on first network-backed render only when we have fresh items
            if (fresh.length) {
              maybeHideSplash();
            }
          }
        }));
      }

      const phase1 = feeds.slice(0, Math.max(0, Math.min(priorityCount, feeds.length)));
      const phase2 = feeds.slice(phase1.length);
      await processBatch(phase1);
      if (accumulated.length < minItemsGoal && phase2.length){
        await processBatch(phase2);
      }

      // Final consolidation with stale fallback
      if (accumulated.length){
        const now = Date.now();
        const ts = (it)=> new Date(it.pubDate || it.published || it.isoDate || '').getTime();
        const fresh = accumulated.filter(it=>{ const t=ts(it); return Number.isFinite(t) && (now - t) <= freshnessMs; });
        let base;
        if (fresh.length){
          base = fresh;
        } else {
          const staleMax = staleCutoffHours * 60 * 60 * 1000;
          const recent = accumulated.filter(it=>{ const t=ts(it); return Number.isFinite(t) && (now - t) <= staleMax; });
          base = recent.length ? recent : accumulated;
        }
        base = base.sort((a,b)=> new Date(b.pubDate||b.published||0) - new Date(a.pubDate||a.published||0));
        renderItems(category, base, maxItems);
        setCache(cacheKey, base.slice(0, maxItems));
        // Ensure splash is hidden after final network consolidation
        maybeHideSplash();
        return;
      }

      // fallback to cache when zero items from network
      const cached = getCache(cacheKey);
      if (cached && (Date.now() - cached.ts) <= cacheTtlMs && Array.isArray(cached.items) && cached.items.length){
        renderItems(category, cached.items, maxItems);
        // No network items; reveal cached so users can interact
        maybeHideSplash();
        return;
      }

      showError();
    }catch(e){
      // on catastrophic failure, show cache if available
      const cached = getCache(cacheKey);
      if (cached && Array.isArray(cached.items) && cached.items.length){
        renderItems(category, cached.items, maxItems);
        maybeHideSplash();
        return;
      }
      showError();
    }
  };
})();