/* Live TV (scoped) - uses assets/js/live-channels.js data and builds UI with existing global styles/themes */
import { channels } from '/assets/js/live-channels.js';

(function(){
	const state = {
		filter: 'All',
		search: '',
		favorites: new Set(JSON.parse(localStorage.getItem('bl_live_favorites')||'[]')),
		activeId: null
	};

	const categories = ['All','News','Sports','Entertainment','Science'];

	function saveFavorites(){
		try{ localStorage.setItem('bl_live_favorites', JSON.stringify([...state.favorites])); }catch{}
	}

	function $(s,root=document){ return root.querySelector(s); }
	function $all(s,root=document){ return [...root.querySelectorAll(s)]; }

	function buildHero(){
		const hero = document.createElement('section');
		hero.className = 'hero-section';
		hero.innerHTML = `
			<div class="container" style="padding:0">
				<div class="hero-media" style="position:relative;overflow:hidden;border-radius:var(--radius-lg)">
					<video id="heroVideo" src="/assets/media/hero.mp4" playsinline muted autoplay loop preload="metadata" style="width:100%;height:min(62vh,520px);object-fit:cover"></video>
					<div class="hero-overlay" style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.55),rgba(0,0,0,.15));display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem">
						<h1 style="color:#fff;font-size:clamp(1.5rem,4vw,2.5rem);font-weight:800;letter-spacing:.2px">
							30 Free Live Channels – Watch Instantly
						</h1>
					</div>
				</div>
			</div>`;
		return hero;
	}

	function buildControls(){
		const wrap = document.createElement('div');
		wrap.className = 'container';
		wrap.innerHTML = `
			<div class="category-header" style="display:flex;gap:1rem;align-items:center;justify-content:space-between;margin:1rem 0">
				<div>
					<h2>Live TV</h2>
					<div class="category-meta">Browse live channels</div>
				</div>
				<div class="filters" role="toolbar" aria-label="Live TV Controls">
					<div class="searchbar">
						<i class="fas fa-search" aria-hidden="true"></i>
						<input id="live-search" placeholder="Search channels..." aria-label="Search channels" />
					</div>
					<div class="tabs" role="tablist" aria-label="Categories" style="display:flex;flex-wrap:wrap;gap:.5rem">
						${categories.map((c,i)=>`<button role="tab" aria-selected="${i===0}" class="filter-btn" data-cat="${c}">${c}</button>`).join('')}
					</div>
					<button id="favorites-toggle" class="filter-btn" title="Show Favorites"><i class="fas fa-star"></i></button>
				</div>
			</div>`;
		return wrap;
	}

	function buildGrid(){
		const wrap = document.createElement('div');
		wrap.className = 'container';
		wrap.innerHTML = `<section id="channel-grid" class="cards-grid" aria-live="polite"></section>`;
		return wrap;
	}

	function buildStickyPlayer(){
		const el = document.createElement('div');
		el.id = 'sticky-player';
		el.setAttribute('aria-hidden','true');
		el.style.position = 'sticky';
		el.style.top = '0';
		el.style.zIndex = '90';
		el.innerHTML = `
			<style>
			@media (max-width: 768px){
				#sticky-player{ position: fixed !important; left:0; right:0; bottom:0; top:auto; z-index: 95; }
				#sticky-player .container{ padding:0 0; }
			}
			</style>
			<div class="container">
				<div id="player-shell" style="background:#000;border-radius:12px;overflow:hidden;display:none;position:relative">
					<div class="player-top" style="position:absolute;left:0;right:0;top:0;padding:.5rem 1rem;display:flex;justify-content:space-between;align-items:center;color:#fff;background:linear-gradient(180deg,rgba(0,0,0,.65),transparent)">
						<div class="player-title"><span class="badge" style="color:#ef4444">● LIVE</span> <span id="player-title">Loading...</span></div>
						<div class="player-actions" style="display:flex;gap:.5rem">
							<button id="player-close" class="icon-btn" title="Close" aria-label="Close player"><i class="fas fa-times"></i></button>
						</div>
					</div>
					<div id="player-container" style="width:100%;aspect-ratio:16/9;background:#000"></div>
				</div>
			</div>`;
		return el;
	}

	function channelCard(c){
		const isFav = state.favorites.has(c.id);
		return `
			<article class="channel-card" data-id="${c.id}" tabindex="0" aria-label="${c.name}">
				<div class=\"channel-thumb\" style=\"position:relative;border-radius:var(--radius-md);overflow:hidden\">
					<img src=\"${c.thumb}\" alt=\"${c.name} thumbnail\" loading=\"lazy\" referrerpolicy=\"no-referrer\" style=\"width:100%;aspect-ratio:16/9;object-fit:cover\" />
					<span class=\"live-pulse\" aria-hidden=\"true\" style=\"position:absolute;left:.5rem;top:.5rem;background:#ef4444;color:#fff;border-radius:999px;padding:.15rem .5rem;font-size:.75rem;font-weight:700\">LIVE</span>
					<img src=\"${c.icon || ''}\" alt=\"${c.name} logo\" loading=\"lazy\" referrerpolicy=\"no-referrer\" style=\"position:absolute;right:.5rem;bottom:.5rem;width:48px;height:48px;object-fit:contain;background:rgba(0,0,0,.3);backdrop-filter:blur(2px);border-radius:8px;padding:.25rem\" />
				</div>
				<header style="display:flex;align-items:center;justify-content:space-between;margin-top:.5rem">
					<h3 style="font-size:1rem">${c.name}</h3>
					<span class="pill" style="border:1px solid var(--border-color);border-radius:999px;padding:.15rem .5rem;font-size:.75rem;color:var(--text-muted)">${c.cat}</span>
				</header>
				<div style="display:flex;gap:.5rem;align-items:center;margin-top:.5rem">
					<button class="watch-btn" data-id="${c.id}" aria-label="Watch ${c.name}" style="background:var(--primary-color);color:#fff;border:0;border-radius:8px;padding:.5rem .75rem;cursor:pointer"><i class="fas fa-play"></i> Watch</button>
					<button class="fav-btn ${isFav?'active':''}" data-id="${c.id}" title="Toggle favorite" aria-pressed="${isFav}" style="border:1px solid var(--border-color);background:var(--surface-color);border-radius:8px;padding:.45rem .6rem;cursor:pointer"><i class="fas fa-star"></i></button>
				</div>
			</article>`;
	}

	function applyFilters(list){
		const q = state.search.trim().toLowerCase();
		return list.filter(c =>
			(state.filter==='All' || c.cat===state.filter) &&
			(!q || c.name.toLowerCase().includes(q))
		);
	}

	function renderGrid(){
		const grid = document.getElementById('channel-grid');
		if(!grid) return;
		const filtered = applyFilters(channels);
		grid.innerHTML = '';
		filtered.forEach(c => {
			const card = document.createElement('div');
			card.className = 'channel-card';
			card.innerHTML = `
				<img class="channel-icon" src="${c.icon || ''}" alt="${c.name}" width="64" height="64" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='/assets/icon-192.svg'" />
				<div class="channel-name">${c.name}</div>
				<button class="watch-btn" aria-label="Watch ${c.name}" data-id="${c.id}"><i class="fas fa-play"></i> Watch</button>
			`;
			const watch = card.querySelector('.watch-btn');
			watch.addEventListener('click', (e) => { e.preventDefault(); openChannel(c.id); });
			grid.appendChild(card);
		});
	}

	function bindGridEvents(){
		// No-op: events are attached per button during render
	}

	function mountPlayerIframe(channel){
		const shell = $('#player-shell');
		const container = $('#player-container');
		const title = $('#player-title');
		shell.style.display='block';
		title.textContent = channel.name;
		container.innerHTML = '';
		const iframe = document.createElement('iframe');
		iframe.setAttribute('allowfullscreen','');
		iframe.style.width = '100%';
		iframe.style.height = '100%';
		iframe.style.border = '0';
		iframe.loading = 'eager';
		let loaded = false;
		iframe.addEventListener('load',()=>{ loaded = true; });
		if(channel.type === 'youtube'){
			iframe.src = channel.embed + (channel.embed.includes('?') ? '&' : '?') + 'autoplay=1&rel=0&mute=1';
			iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
			iframe.referrerPolicy = 'strict-origin-when-cross-origin';
			iframe.setAttribute('sandbox','allow-same-origin allow-scripts allow-presentation');
		}else{
			iframe.src = channel.embed;
			iframe.referrerPolicy = 'no-referrer';
			iframe.setAttribute('sandbox','allow-same-origin allow-scripts allow-forms allow-popups');
			setTimeout(()=>{
				if(!loaded){
					container.innerHTML = `<div style="color:#fff;display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:.5rem;text-align:center;padding:1rem">This channel cannot be embedded by the provider.<br><a href="${channel.embed}" target="_blank" rel="noopener noreferrer" style="color:#fff;text-decoration:underline">Open channel directly</a></div>`;
				}
			}, 4500);
		}
		container.appendChild(iframe);
		state.activeId = channel.id;
		$('#sticky-player').setAttribute('aria-hidden','false');
	}

	function openChannel(id){
		const channel = channels.find(c=>c.id===id);
		if(!channel) return;
		const titleEl = document.getElementById('player-title');
		const iframeEl = document.getElementById('live-player');
		const box = document.getElementById('player-box');
		if (iframeEl && titleEl && box) {
			// Force immediate reveal, then assign src (prevents layout shift)
			box.classList.remove('player-hidden');
			document.body.classList.add('player-active');
			titleEl.textContent = channel.name;
			// Write src last for faster visual feedback
			iframeEl.src = channel.embed + (channel.embed.includes('?') ? '&' : '?') + 'autoplay=1&rel=0&mute=1';
		} else {
			mountPlayerIframe(channel);
		}
	}

	function bindControls(){
		const search = $('#live-search');
		if (search) {
			let t; 
			search.addEventListener('input',()=>{ 
				clearTimeout(t); 
				t=setTimeout(()=>{ state.search=search.value; renderGrid(); },250); 
			});
		}
		const tabs = $all('[role="tab"]');
		if (tabs.length) {
			tabs.forEach(btn=>{
				btn.addEventListener('click',()=>{
					$all('[role="tab"]').forEach(b=>b.setAttribute('aria-selected','false'));
					btn.setAttribute('aria-selected','true');
					state.filter = btn.dataset.cat;
					renderGrid();
				});
			});
		}
		const favToggle = $('#favorites-toggle');
		if (favToggle) {
			let favMode=false;
			favToggle.addEventListener('click',()=>{
				favMode=!favMode; favToggle.classList.toggle('active', favMode);
				if(favMode){
					const favIds = new Set(state.favorites);
					const favList = channels.filter(c=>favIds.has(c.id));
					const grid = document.getElementById('channel-grid');
					if (grid) {
						grid.innerHTML = '';
						favList.forEach(c => {
							const card = document.createElement('div');
							card.className = 'channel-card';
							card.innerHTML = `
								<img class="channel-icon" src="${c.icon || ''}" alt="${c.name}" width="64" height="64" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='/assets/icon-192.svg'" />
								<div class="channel-name">${c.name}</div>
								<button class="watch-btn" aria-label="Watch ${c.name}" data-id="${c.id}"><i class="fas fa-play"></i> Watch</button>
							`;
							card.querySelector('.watch-btn').addEventListener('click', (e)=>{ e.preventDefault(); openChannel(c.id); });
							grid.appendChild(card);
						});
					}
				}else{
					renderGrid();
				}
			});
		}
		const close = $('#player-close');
		if (close) {
			close.addEventListener('click',()=>{
				const shell = $('#player-shell');
				$('#player-container').innerHTML='';
				shell.style.display='none';
				state.activeId=null;
				$('#sticky-player').setAttribute('aria-hidden','true');
			});
		}
		document.addEventListener('keydown',e=>{ if(e.key==='Escape' && state.activeId){ if (close) close.click(); } });
	}

	function bindPlayerClose(){
		const closeBtn = document.querySelector('.close-btn');
		const box = document.getElementById('player-box');
		const iframeEl = document.getElementById('live-player');
		if (closeBtn && box && iframeEl){
			closeBtn.addEventListener('click', ()=>{
				iframeEl.src = '';
				box.classList.add('player-hidden');
				document.body.classList.remove('player-active');
			});
			document.addEventListener('keydown', (e)=>{
				if(e.key==='Escape'){
					closeBtn.click();
				}
			});
		}
	}

	document.addEventListener('DOMContentLoaded',()=>{
		// Use existing markup only: player-box and channel-grid are in live-tv.html
		bindControls();
		renderGrid();
		bindPlayerClose();
	});
})();