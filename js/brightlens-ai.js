// Brightlens AI Panel (client-only) - Climate MVP
(function(){
  const PANEL_ID = 'bl-ai-panel';
  const CACHE_PREFIX = 'bl_ai_summary_';

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
          h('div', { class: 'ai-tabs' }, [
            h('button', { class: 'ai-tab active', id: 'ai-tab-summary', 'aria-selected': 'true' }, ['Summary']),
            h('button', { class: 'ai-tab', id: 'ai-tab-article', 'aria-selected': 'false' }, ['Full Article'])
          ]),
          h('div', { class: 'ai-panel-summary', id: 'ai-summary' }, [
            h('div', { class: 'loading' }, [
              h('div', { class: 'spinner' }),
              document.createTextNode(' Generating summary…')
            ])
          ]),
          h('div', { class: 'ai-panel-summary', id: 'ai-article', style: 'display:none' }, [
            h('div', { class: 'loading' }, [
              h('div', { class: 'spinner' }),
              document.createTextNode(' Loading article…')
            ])
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
          ])
        ])
      ])
    ]);
    document.body.appendChild(root);

    const close = ()=> root.classList.remove('open');
    root.querySelector('.ai-panel-backdrop').addEventListener('click', close);
    root.querySelector('.ai-panel-close').addEventListener('click', close);
    // Escape to close
    window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') close(); });
    // Basic swipe close on mobile
    let startX=null; root.querySelector('.ai-panel-content').addEventListener('touchstart', e=>{ startX=e.touches[0].clientX; });
    root.querySelector('.ai-panel-content').addEventListener('touchend', e=>{ if(startX!=null && (startX - (e.changedTouches[0].clientX)) < -60) close(); startX=null; });

    // Tabs
    const tabSummary = root.querySelector('#ai-tab-summary');
    const tabArticle = root.querySelector('#ai-tab-article');
    const viewSummary = ()=>{
      tabSummary.classList.add('active'); tabSummary.setAttribute('aria-selected','true');
      tabArticle.classList.remove('active'); tabArticle.setAttribute('aria-selected','false');
      root.querySelector('#ai-summary').style.display='block';
      root.querySelector('#ai-article').style.display='none';
    };
    const viewArticle = ()=>{
      tabArticle.classList.add('active'); tabArticle.setAttribute('aria-selected','true');
      tabSummary.classList.remove('active'); tabSummary.setAttribute('aria-selected','false');
      root.querySelector('#ai-summary').style.display='none';
      root.querySelector('#ai-article').style.display='block';
    };
    tabSummary.addEventListener('click', viewSummary);
    tabArticle.addEventListener('click', viewArticle);
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

  function getCache(url){
    try{ const raw = localStorage.getItem(CACHE_PREFIX + url); return raw ? JSON.parse(raw) : null; }catch(_){ return null; }
  }
  function setCache(url, data){
    try{ localStorage.setItem(CACHE_PREFIX + url, JSON.stringify({ ts: Date.now(), data })); }catch(_){ /* ignore */ }
  }

  function extractDomain(u){ try{ return new URL(u).hostname.replace(/^www\./,''); }catch(_){ return ''; } }

  async function fetchArticleHTML(url){
    const prox = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(prox, { cache: 'no-store' });
    if (!res.ok) throw new Error('proxy');
    const j = await res.json();
    return j.contents || '';
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
    const sum = panel.querySelector('#ai-summary');
    const art = panel.querySelector('#ai-article');

    hero.src = image || 'https://images.weserv.nl/?url=via.placeholder.com/1600x900&h=900&w=1600&fit=cover';
    ttl.textContent = title || 'Untitled';
    tag.textContent = category || 'Climate';
    tim.textContent = time || '';
    src.href = url || '#';
    sum.innerHTML = '<div class="loading"><div class="spinner"></div> Generating summary…</div>';
    art.innerHTML = '<div class="loading"><div class="spinner"></div> Loading article…</div>';
  }

  async function generateAndRender(url){
    const sum = document.getElementById('ai-summary');
    const art = document.getElementById('ai-article');
    if (!sum) return;
    try{
      const cached = getCache(url);
      if (cached && cached.data && cached.ts && (Date.now() - cached.ts) < (12*60*60*1000)){
        sum.textContent = cached.data.summary || '';
        if (art) art.innerHTML = cached.data.article || '';
        return;
      }
      const html = await fetchArticleHTML(url);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const extracted = extractMain(doc);
      // Upgrade header from OG if better
      const hero = document.getElementById('ai-hero');
      if (extracted.ogImage && hero) try{ const u=new URL(extracted.ogImage, url); hero.src = `https://images.weserv.nl/?url=${encodeURIComponent(u.href.replace(/^https?:\/\//,''))}`; }catch(_){ /* ignore */ }
      const timeEl = document.getElementById('ai-time');
      if (extracted.pubTime && timeEl) timeEl.textContent = new Date(extracted.pubTime).toLocaleString();

      const summary = summarizeExtractive(extracted.text || '', 10);
      sum.textContent = summary || 'No summary available.';
      if (art) art.innerHTML = sanitizeAndRewrite(extracted.html || '');
      setCache(url, { summary, article: art ? art.innerHTML : '' });
    }catch(e){
      sum.innerHTML = '<div class="loading">Unable to summarize. <a target="_blank" rel="noopener">Open original</a></div>';
      const a = sum.querySelector('a'); if (a) a.href = url;
      if (art) art.innerHTML = '<div class="loading">Unable to load article.</div>';
    }
  }

  function attachClimateInterceptors(){
    // Only on climate page
    const isClimate = /\bclimate(?:\.html)?$/i.test((location.pathname||'').split('/').pop() || '') || document.title.toLowerCase().includes('climate');
    if (!isClimate) return;
    // Delegate on news grid
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    grid.addEventListener('click', (e)=>{
      const link = e.target.closest('a.news-link, .news-actions .news-link');
      if (!link) return;
      e.preventDefault();
      const card = e.target.closest('article.news-card');
      const title = card?.querySelector('.news-title')?.textContent || link?.textContent || '';
      const category = card?.querySelector('.news-category')?.textContent || 'Climate';
      const img = card?.querySelector('.news-image img')?.getAttribute('data-src') || card?.querySelector('.news-image img')?.src || '';
      const url = link?.getAttribute('href') || link?.href || '';
      const time = card?.querySelector('.news-date')?.textContent || '';
      openPanel({ title, url, image: img, category, time });
      // start generation asynchronously
      generateAndRender(url);
    });
  }

  // Initialize fast, defer heavy work until interaction
  function init(){
    // Only insert panel on climate page to keep others zero-cost
    const isClimate = /\bclimate(?:\.html)?$/i.test((location.pathname||'').split('/').pop() || '') || document.title.toLowerCase().includes('climate');
    if (!isClimate) return;
    // Defer panel creation until first click to keep critical path minimal
    attachClimateInterceptors();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();