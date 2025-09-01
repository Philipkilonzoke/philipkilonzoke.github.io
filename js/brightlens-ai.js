// Brightlens AI Panel (client-only) - Multi-category
(function(){
  if (window.__BL_AI_LOADED) return; 
  window.__BL_AI_LOADED = true;
  const PANEL_ID = 'bl-ai-panel';
  const CACHE_PREFIX = 'bl_ai_summary_';
  const MEM_CACHE = new Map(); // in-memory LRU-lite
  const CACHE_VERSION = 'v2';
  let lastMode = 'local'; // 'local' | 'llm'

  function h(type, props = {}, children = []){
    const el = document.createElement(type);
    Object.entries(props).forEach(([k,v])=>{
      if (k === 'class') el.className = v;
      else if (k === 'style') el.setAttribute('style', v);
      else el.setAttribute(k, v);
    });
    children.forEach(c => typeof c === 'string' ? el.appendChild(document.createTextNode(c)) : (c && el.appendChild(c)));
    return el;
  }

  function ensurePanel(){
    if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);
    const root = h('div', { id: PANEL_ID, class: 'ai-panel' }, [
      h('div', { class: 'ai-panel-backdrop' }),
      h('div', { class: 'ai-panel-content' }, [
        h('button', { class: 'ai-panel-close', 'aria-label': 'Close' }, [h('i', { class: 'fas fa-times' })]),
        h('div', { class: 'ai-panel-hero' }, [h('img', { id: 'ai-hero', alt: '' })]),
        h('div', { class: 'ai-panel-body' }, [
          h('h2', { class: 'ai-panel-title', id: 'ai-title' }),
          h('div', { class: 'ai-panel-meta' }, [
            h('span', { class: 'ai-panel-tag', id: 'ai-category' }),
            h('span', { id: 'ai-time' })
          ]),
          // Skeletons
          h('div', { id: 'ai-skeletons' }, [
            h('div', { class: 'ai-skel title' }),
            h('div', { class: 'ai-skel meta' }),
            h('div', { class: 'ai-skel block' }),
            h('div', { class: 'ai-skel block' }),
            h('div', { class: 'ai-skel block' })
          ]),
          // Key takeaways + Why it matters section
          h('div', { class: 'ai-panel-summary', id: 'ai-highlights' }, [
            h('h3', {}, ['Key takeaways']),
            h('ul', { id: 'ai-bullets' }),
            h('h3', {}, ['Why it matters']),
            h('div', { id: 'ai-why' })
          ]),
          // Single loader row
          h('div', { class: 'ai-panel-summary', id: 'ai-loader' }, [
            h('div', { class: 'loading' }, [ h('div', { class: 'spinner' }), document.createTextNode(' Processing article…') ])
          ])
        ]),
        h('div', { class: 'ai-panel-footer' }, [
          h('div', { class: 'ai-source' }, [
            document.createTextNode('Read original: '),
            h('a', { id: 'ai-source', target: '_blank', rel: 'noopener' }, ['Open link'])
          ]),
          h('div', { class: 'ai-share' }, [
            shareBtn('WhatsApp', 'fab fa-whatsapp', (t,u)=>`https://api.whatsapp.com/send?text=${encodeURIComponent(t+' '+u)}`),
            shareBtn('Facebook', 'fab fa-facebook-f', (_t,u)=>`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`),
            shareBtn('Telegram', 'fab fa-telegram', (t,u)=>`https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`),
            shareBtn('Twitter', 'fab fa-twitter', (t,u)=>`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`)
          ]),
          h('div', { class: 'ai-health' }, [ h('span', { id: 'ai-badge' }, ['AI: Local']) ]),
          h('div', { class: 'ai-font' }, [
            fontBtn('A-', 'small'), fontBtn('A', 'medium', true), fontBtn('A+', 'large')
          ])
        ])
      ])
    ]);
    document.body.appendChild(root);

    const close = ()=> root.classList.remove('open');
    // Only allow explicit close via the close button
    root.querySelector('.ai-panel-close').addEventListener('click', close);

    // No tabs anymore
    return root;
  }

  function shareBtn(title, icon, build){
    const btn = h('button', { class: 'share-btn', title });
    btn.appendChild(h('i', { class: icon }));
    btn.addEventListener('click', ()=>{
      const t = document.getElementById('ai-title')?.textContent || '';
      const u = document.getElementById('ai-source')?.href || '';
      const url = build(t, u);
      window.open(url, '_blank');
    });
    return btn;
  }

  function fontBtn(label, size, active){
    const b = h('button', { 'data-size': size, class: active ? 'active' : '' }, [label]);
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.ai-font button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const root = document.getElementById(PANEL_ID);
      if (!root) return;
      root.querySelectorAll('.ai-panel-summary').forEach(el=>{
        el.style.fontSize = size === 'small' ? '0.95rem' : size === 'large' ? '1.08rem' : '1rem';
        el.style.lineHeight = size === 'small' ? '1.6' : size === 'large' ? '1.8' : '1.7';
      });
      const title = root.querySelector('.ai-panel-title');
      if (title) title.style.fontSize = size === 'small' ? '1.25rem' : size === 'large' ? '1.55rem' : '1.4rem';
    });
    return b;
  }

  function getCache(url){
    try{
      if (MEM_CACHE.has(url)) return MEM_CACHE.get(url);
      const raw = localStorage.getItem(CACHE_PREFIX + CACHE_VERSION + '_' + url);
      const j = raw ? JSON.parse(raw) : null;
      if (j) MEM_CACHE.set(url, j);
      return j;
    }catch(_){ return null; }
  }
  function setCache(url, data){
    try{
      const j = { ts: Date.now(), data };
      MEM_CACHE.set(url, j);
      localStorage.setItem(CACHE_PREFIX + CACHE_VERSION + '_' + url, JSON.stringify(j));
      // simple LRU cap
      if (MEM_CACHE.size > 80){ MEM_CACHE.delete(MEM_CACHE.keys().next().value); }
    }catch(_){ /* ignore */ }
  }

  function extractDomain(u){ try{ return new URL(u).hostname.replace(/^www\./,''); }catch(_){ return ''; } }

  function fetchWithTimeout(resource, options = {}, timeoutMs = 5000){
    const ctrl = new AbortController();
    const id = setTimeout(()=>ctrl.abort(), timeoutMs);
    return fetch(resource, { ...options, signal: ctrl.signal }).finally(()=>clearTimeout(id));
  }

  async function fetchArticleHTML(url){
    const prox = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetchWithTimeout(prox, { cache: 'no-store' }, 6000);
    if (!res.ok) throw new Error('proxy');
    const j = await res.json();
    return j.contents || '';
  }

  async function fetchArticleTextJina(url){
    // r.jina.ai extracts readable text for many pages, CORS-friendly
    const endpoint = `https://r.jina.ai/http://${url.replace(/^https?:\/\//,'')}`;
    const res = await fetchWithTimeout(endpoint, { cache: 'no-store' }, 5000);
    if (!res.ok) throw new Error('jina');
    const txt = await res.text();
    return (txt || '').trim();
  }

  function extractMain(doc){
    const getText = (el)=> (el ? (el.innerText || el.textContent || '').trim() : '');
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.content || '';
    const ogImage = doc.querySelector('meta[property="og:image"]')?.content || '';
    const pubTime = doc.querySelector('meta[property="article:published_time"]')?.content || doc.querySelector('time')?.getAttribute('datetime') || '';
    const articleNode = doc.querySelector('article, main article, .article, .post, #article, #content article');

    // Prefer an article-like node's HTML; else build from largest paragraph cluster
    let html = '';
    if (articleNode) html = articleNode.innerHTML || '';
    if (!html || html.replace(/<[^>]+>/g,' ').trim().split(/\s+/).length < 80){
      const paragraphs = Array.from(doc.querySelectorAll('p')).map(p=>p.outerHTML || '').filter(Boolean);
      // pick densest sequence of <p>
      let best = ''; let buf = [];
      paragraphs.forEach(ph=>{
        const textLen = ph.replace(/<[^>]+>/g,' ').trim().length;
        if (textLen < 40) { if (buf.length) buf.push(ph); return; }
        buf.push(ph);
        const joined = buf.join('');
        if (joined.replace(/<[^>]+>/g,' ').length > best.replace(/<[^>]+>/g,' ').length) best = joined;
      });
      html = best || paragraphs.slice(0, 12).join('');
    }
    const text = (articleNode ? getText(articleNode) : html.replace(/<[^>]+>/g,' ')).trim();
    return { ogTitle, ogImage, pubTime, html, text };
  }

  function sanitizeAndRewrite(html){
    try{
      const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
      const root = doc.body.firstElementChild;
      // strip dangerous tags
      root.querySelectorAll('script,style,noscript,iframe,object,embed,form,link').forEach(n=>n.remove());
      // remove event handlers, inline JS
      root.querySelectorAll('*').forEach(el=>{ Array.from(el.attributes).forEach(a=>{ if (/^on/i.test(a.name)) el.removeAttribute(a.name); }); });
      // proxy images
      root.querySelectorAll('img').forEach(img=>{
        const src = img.getAttribute('src')||''; if (!src) return;
        try{ const u = new URL(src, location.href); img.setAttribute('src', `https://images.weserv.nl/?url=${encodeURIComponent(u.href.replace(/^https?:\/\//,''))}`); }catch(_){ /* ignore */ }
        img.setAttribute('loading','lazy'); img.setAttribute('decoding','async');
        img.style.maxWidth = '100%'; img.style.height = 'auto';
      });
      return root.innerHTML;
    }catch(_){ return '';
    }
  }

  function summarizeExtractive(text, targetSentences = 10){
    // Very fast, basic extractive summary: rank sentences by length + keyword frequency
    const clean = text.replace(/\s+/g,' ').trim();
    const sentences = clean.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).slice(0, 60);
    if (sentences.length <= targetSentences) return clean;
    const stop = new Set(['the','is','a','an','of','and','to','in','for','on','with','as','by','it','that','from','at','this','be']);
    const freq = Object.create(null);
    clean.toLowerCase().split(/[^a-z0-9]+/).filter(w=>w && !stop.has(w)).forEach(w=>{ freq[w]=(freq[w]||0)+1; });
    const scored = sentences.map(s=>{
      const ws = s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      const score = ws.reduce((acc,w)=> acc + (freq[w]||0), 0) + Math.min(s.length/80, 3);
      return { s, score };
    }).sort((a,b)=> b.score - a.score);
    const top = scored.slice(0, targetSentences).map(x=>x.s);
    // keep original order
    const order = new Map(top.map((t,i)=>[t,i]));
    return sentences.filter(s=> order.has(s)).join(' ');
  }

  function openPanel({ title, url, image, category, time }){
    const panel = ensurePanel();
    panel.classList.add('open');
    const hero = panel.querySelector('#ai-hero');
    const ttl = panel.querySelector('#ai-title');
    const tag = panel.querySelector('#ai-category');
    const tim = panel.querySelector('#ai-time');
    const src = panel.querySelector('#ai-source');

    hero.src = image || 'https://images.weserv.nl/?url=via.placeholder.com/1600x900&h=900&w=1600&fit=cover';
    ttl.textContent = title || 'Untitled';
    tag.textContent = category || 'News';
    tim.textContent = time || '';
    src.href = url || '#';
    const skel = document.getElementById('ai-skeletons'); if (skel) skel.style.display='block';
    const loader = document.getElementById('ai-loader'); if (loader) loader.style.display='block';
  }

  function toParagraphHTML(text){
    const clean = (text || '').replace(/\s+/g,' ').trim();
    if (!clean) return '';
    const sentences = clean.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
    const blocks = [];
    for (let i=0; i<sentences.length; i+=3){
      const chunk = sentences.slice(i, i+3).join(' ');
      if (chunk.trim()) blocks.push(`<p>${escapeHTML(chunk.trim())}</p>`);
    }
    return blocks.join('');
  }

  function escapeHTML(s){
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

  async function generateAndRender(url, opts = { silent: false, fallbackDesc: '' }){
    const loader = document.getElementById('ai-loader');
    try{
      const cached = getCache(url);
      if (cached && cached.data && cached.ts && (Date.now() - cached.ts) < (12*60*60*1000)){
        if (!opts.silent) {
          const ul = document.getElementById('ai-bullets');
          const whyEl = document.getElementById('ai-why');
          const skel = document.getElementById('ai-skeletons'); if (skel) skel.style.display='none';
          if (ul){ ul.innerHTML = toParagraphHTML(cached.data.summary || '').split(/<\/p>/).filter(Boolean).slice(0,4).map(p=>`<li>${p.replace(/^<p>|<\/p>$/g,'')}</li>`).join(''); }
          if (whyEl){ whyEl.innerHTML = toParagraphHTML(cached.data.summary || ''); }
          if (loader) loader.style.display='none';
        }
        return;
      }
      // Prefer Jina text first for reliability; parallelize with HTML proxy
      const pJina = (async()=>{
        try{ const txt = await fetchArticleTextJina(url); return { type:'text', data: txt }; }catch(_){ return { type:'text', error:true, data:'' }; }
      })();
      const pAllOrigins = (async()=>{
        try{ const html = await fetchArticleHTML(url); const doc = new DOMParser().parseFromString(html, 'text/html'); return { type:'html', data: extractMain(doc) }; }catch(_){ return { type:'html', error:true, data:null }; }
      })();

      const [rText, rHtml] = await Promise.all([pJina, pAllOrigins]);
      const textCandidate = (rText.type==='text' && !rText.error && (rText.data||'').length > 120) ? rText.data : '';
      const htmlCandidate = (rHtml.type==='html' && rHtml.data && (rHtml.data.text||'').length > 120) ? rHtml.data : null;
      const baseText = textCandidate || (htmlCandidate?.text || '');

      // Header enrich
      if (!opts.silent && htmlCandidate) {
        const hero = document.getElementById('ai-hero');
        if (htmlCandidate.ogImage && hero) try{ const u=new URL(htmlCandidate.ogImage, url); hero.src = `https://images.weserv.nl/?url=${encodeURIComponent(u.href.replace(/^https?:\/\//,''))}`; }catch(_){ /* ignore */ }
        const timeEl = document.getElementById('ai-time');
        if (htmlCandidate.pubTime && timeEl) timeEl.textContent = new Date(htmlCandidate.pubTime).toLocaleString();
      }

      // Short/paywalled fallback
      if (!baseText || baseText.replace(/\s+/g,' ').trim().length < 120) {
        if (!opts.silent) {
          const ul = document.getElementById('ai-bullets');
          const whyEl = document.getElementById('ai-why');
          if (ul){
            const desc = (opts.fallbackDesc || '').trim();
            if (desc){
              const parts = desc.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).slice(0,4);
              ul.innerHTML = parts.map(x=>`<li>${escapeHTML(x)}</li>`).join('');
            } else {
              ul.innerHTML = '';
            }
          }
          if (whyEl) {
            const desc = (opts.fallbackDesc || '').trim();
            whyEl.innerHTML = desc ? toParagraphHTML(desc) : '<div class="loading">Open the original article for details.</div>';
          }
          if (loader) loader.style.display='none';
        }
        setCache(url, { summary: '', article: '' });
        return;
      }

      // Progressive summarization via Web Worker
      const clean = baseText.replace(/\s+/g,' ').trim();
      const worker = new Worker('/js/ai-worker.js');
      let summary = '';
      const joined = clean;
      const ul = document.getElementById('ai-bullets');
      const whyEl = document.getElementById('ai-why');
      const skel = document.getElementById('ai-skeletons');
      worker.postMessage({ type: 'summarize', text: joined.slice(0, 25000) });
      const workerResult = await new Promise((resolve) => {
        const timer = setTimeout(()=>{ try{ worker.terminate(); }catch(_){ } resolve(null); }, 3000);
        worker.onmessage = (ev)=>{ clearTimeout(timer); resolve(ev.data || null); };
        worker.onerror = ()=>{ clearTimeout(timer); resolve(null); };
      });
      if (workerResult && workerResult.type === 'summary'){
        const bullets = (workerResult.bullets||[]).slice(0,6);
        const why = workerResult.why || '';
        const context = workerResult.context || '';
        if (!opts.silent){
          if (skel) skel.style.display='none';
          if (ul) ul.innerHTML = bullets.map(x=>`<li>${escapeHTML(x)}</li>`).join('');
          if (whyEl) {
            const blocks = [];
            if (why) blocks.push(toParagraphHTML(why));
            if (context) blocks.push('<h4>Context</h4>' + toParagraphHTML(context));
            whyEl.innerHTML = blocks.join('');
          }
          if (loader) loader.style.display='none';
        }
        summary = [bullets.join(' '), why, context].filter(Boolean).join(' ');
      } else {
        // Fallback to built-in summarizer
        let sum = summarizeExtractive(joined, 10) || joined.slice(0, 1200);
        if (!opts.silent){
          if (skel) skel.style.display='none';
          if (ul){ const parts = summarizeExtractive(joined, 6).split(/(?<=[.!?])\s+(?=[A-Z0-9])/).slice(0,6); ul.innerHTML = parts.map(x=>`<li>${escapeHTML(x)}</li>`).join(''); }
          if (whyEl){ const first = (summarizeExtractive(joined, 2).split(/(?<=[.!?])\s+(?=[A-Z0-9])/)[0]||''); whyEl.innerHTML = toParagraphHTML(first); }
          if (loader) loader.style.display='none';
        }
        summary = sum;
      }

      if (!opts.silent) {
        const ul = document.getElementById('ai-bullets');
        const whyEl = document.getElementById('ai-why');
        const skel = document.getElementById('ai-skeletons'); if (skel) skel.style.display='none';
        if (ul){ ul.innerHTML = bullets.map(x=>`<li>${escapeHTML(x)}</li>`).join(''); }
        if (whyEl){ whyEl.innerHTML = toParagraphHTML(why || summary.split(/(?<=[.!?])\s+(?=[A-Z0-9])/)[0] || ''); }
        if (loader) loader.style.display='none';
      }

      // Optional LLM upgrade (structured JSON)
      try{
        const endpoint = window.BL_LLM_ENDPOINT;
        if (endpoint && joined && joined.length > 200) {
          const ctrl = new AbortController();
          const timer = setTimeout(()=>ctrl.abort(), 4000);
          const r = await fetch(`${endpoint.replace(/\/$/,'')}/summarize_structured`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: joined.slice(0, 20000), max_words: 180 }), signal: ctrl.signal
          });
          clearTimeout(timer);
          if (r.ok) {
            const j = await r.json();
            if (j && (j.what_happened || j.key_details || j.why_it_matters || j.context)){
              if (!opts.silent){
                const ul = document.getElementById('ai-bullets');
                const whyEl = document.getElementById('ai-why');
                const skel = document.getElementById('ai-skeletons'); if (skel) skel.style.display='none';
                if (ul && Array.isArray(j.key_details)){
                  ul.innerHTML = j.key_details.slice(0,6).map(x=>`<li>${escapeHTML(String(x))}</li>`).join('');
                }
                if (whyEl){
                  const blocks = [];
                  if (j.what_happened) blocks.push(toParagraphHTML(String(j.what_happened)));
                  if (Array.isArray(j.why_it_matters)) blocks.push('<h4>Why it matters</h4>' + toParagraphHTML(j.why_it_matters.join(' ')));
                  if (j.context) blocks.push('<h4>Context</h4>' + toParagraphHTML(String(j.context)));
                  whyEl.innerHTML = blocks.join('');
                }
                if (loader) loader.style.display='none';
              }
              summary = [j.what_happened, (j.key_details||[]).join(' '), (j.why_it_matters||[]).join(' '), j.context].filter(Boolean).join(' ');
            }
          }
        }
      }catch(_){ }

      setCache(url, { summary, article: '' });
      const badge = document.getElementById('ai-badge'); if (!opts.silent && badge) badge.textContent = `AI: ${lastMode === 'llm' ? 'LLM' : 'Local'}`;
    }catch(e){
      try{
        const txt = await fetchArticleTextJina(url);
        if (txt) {
          const quick = summarizeExtractive(txt, 10) || txt.slice(0,1200);
          if (!opts.silent) {
            const ul = document.getElementById('ai-bullets');
            const whyEl = document.getElementById('ai-why');
            const skel = document.getElementById('ai-skeletons'); if (skel) skel.style.display='none';
            const parts = quick.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
            if (ul){ ul.innerHTML = parts.slice(0,4).map(x=>`<li>${escapeHTML(x)}</li>`).join(''); }
            if (whyEl){ whyEl.innerHTML = toParagraphHTML(parts[0] || ''); }
            if (loader) loader.style.display='none';
          }
          setCache(url, { summary: quick, article: '' });
          return;
        }
      }catch(_){ }
      if (!opts.silent) {
        const ul = document.getElementById('ai-bullets');
        const whyEl = document.getElementById('ai-why');
        if (ul){
          const desc = (opts.fallbackDesc || '').trim();
          if (desc){ const parts = desc.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).slice(0,4); ul.innerHTML = parts.map(x=>`<li>${escapeHTML(x)}</li>`).join(''); }
          else ul.innerHTML = '';
        }
        if (whyEl){
          const desc = (opts.fallbackDesc || '').trim();
          whyEl.innerHTML = desc ? toParagraphHTML(desc) : '<div class="loading">Open the original article for details.</div>';
        }
        if (loader) loader.style.display='none';
      }
    }
  }

  // Low-cost background prefetch: generate summary and cache only
  async function prefetchSummary(url){
    try{
      if (getCache(url)) return;
      const txt = await fetchArticleTextJina(url);
      if (!txt) return;
      const quick = summarizeExtractive(txt, 8) || txt.slice(0,1000);
      setCache(url, { summary: quick, article: '' });
    }catch(_){ /* ignore */ }
  }

  function attachCategoryInterceptors(){
    // Attach to any allowed category page
    const page = ((location.pathname||'').split('/').pop() || '').toLowerCase();
    const allowed = isAllowedCategoryPage(page, document.title);
    if (!allowed) return;
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    // Background prefetch summaries for top articles after grid first paint
    const idle = window.requestIdleCallback || function(fn){ return setTimeout(fn, 500); };
    idle(()=>{
      try{
        const cards = Array.from(grid.querySelectorAll('article.news-card')).slice(0, 4);
        cards.forEach(card=>{
          const link = card.querySelector('.news-link');
          const url = link?.getAttribute('href') || link?.href || '';
          if (!url || getCache(url)) return;
          prefetchSummary(url);
        });
      }catch(_){/*ignore*/}
    });
    let currentToken = 0;
    function resetPanel(){
      const sum = document.getElementById('ai-summary');
      const art = document.getElementById('ai-article');
      const bullets = document.getElementById('ai-bullets');
      const why = document.getElementById('ai-why');
      const skel = document.getElementById('ai-skeletons');
      if (sum) sum.innerHTML = '<div class="loading"><div class="spinner"></div> Generating summary…</div>';
      if (art) art.innerHTML = '<div class="loading"><div class="spinner"></div> Loading article…</div>';
      if (bullets) bullets.innerHTML = '';
      if (why) why.innerHTML = '';
      if (skel) skel.style.display = 'block';
    }

    grid.addEventListener('click', (e)=>{
      const link = e.target.closest('a.news-link, .news-actions .news-link');
      if (!link) return;
      e.preventDefault();
      const card = e.target.closest('article.news-card');
      const title = card?.querySelector('.news-title')?.textContent || link?.textContent || '';
      const category = card?.querySelector('.news-category')?.textContent || 'News';
      const img = card?.querySelector('.news-image img')?.getAttribute('data-src') || card?.querySelector('.news-image img')?.src || '';
      const url = link?.getAttribute('href') || link?.href || '';
      const time = card?.querySelector('.news-date')?.textContent || '';
      const fallbackDesc = card?.querySelector('.news-description')?.textContent || '';
      currentToken += 1; const token = currentToken;
      resetPanel();
      openPanel({ title, url, image: img, category, time });
      // start generation asynchronously with request scoping
      (async()=>{ await generateAndRender(url, { silent: false, fallbackDesc }); if (token !== currentToken){ /* stale */ return; } })();
    });

    // Hover/focus prefetch and cancellation
    grid.addEventListener('mouseover', (e)=>{
      const link = e.target.closest('a.news-link'); if (!link) return;
      const url = link.getAttribute('href') || link.href || ''; if (!url || getCache(url)) return;
      prefetchSummary(url);
    });
  }

  // Initialize fast, defer heavy work until interaction
  function init(){
    // Only insert panel on allowed category pages
    const page = ((location.pathname||'').split('/').pop() || '').toLowerCase();
    const title = document.title.toLowerCase();
    const allowed = isAllowedCategoryPage(page, title);
    if (!allowed) return;
    ensureStyles();
    ensurePreconnect();
    attachCategoryInterceptors();
  }

  function ensureStyles(){
    try{
      const has = Array.from(document.styleSheets||[]).some(s=> (s.href||'').includes('/css/ai-panel.css')) || !!document.querySelector('link[href*="/css/ai-panel.css"]');
      if (!has){
        const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/css/ai-panel.css'; document.head.appendChild(l);
      }
    }catch(_){ /* ignore */ }
  }

  function ensurePreconnect(){
    try{
      const hosts = ['https://api.allorigins.win','https://r.jina.ai','https://images.weserv.nl'];
      hosts.forEach(h=>{
        if (document.querySelector(`link[rel="preconnect"][href="${h}"]`)) return;
        const l = document.createElement('link'); l.rel = 'preconnect'; l.href = h; l.crossOrigin = '';
        document.head.appendChild(l);
      });
    }catch(_){ /* ignore */ }
  }

  function isAllowedCategoryPage(pageFilename, docTitle){
    const title = (docTitle||'').toLowerCase();
    const slug = (pageFilename||'').replace(/\.html$/,'');
    const allowedSlugs = new Set([
      'ai','climate','fact-check','science','cybersecurity','markets','mobility','gaming','africa','energy','spaceflight','real-estate','agriculture','personal-finance','politics','travel','startups','quantum','robotics','ar-vr','iot','biotech','defense','maritime','logistics','ecommerce','cloud','dev-open-source',
      'europe','north-america','latin-america','asia-pacific','mena'
    ]);
    if (allowedSlugs.has(slug)) return true;
    // Fallback to title heuristics
    const keywords = ['ai','climate','fact','science','cyber','market','mobility','gaming','africa','energy','space','real estate','agriculture','personal finance','politics','travel','startup','quantum','robotics','ar','iot','biotech','defense','maritime','logistics','commerce','cloud','open source','europe','north america','latin america','asia','pacific','mena','middle east','north africa'];
    return keywords.some(k => title.includes(k));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();