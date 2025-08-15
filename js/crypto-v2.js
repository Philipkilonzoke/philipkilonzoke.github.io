(function(){
  const ACCESS_KEY = '9147c63b744e110e899dbdc98cfe5897';
  const API_BASE = 'https://api.coinlayer.com';
  const REFRESH_MS = 30000;

  const COINS = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', icon: '🧠' },
    { symbol: 'BNB', name: 'BNB', icon: '🏦' },
    { symbol: 'XRP', name: 'XRP', icon: '💧' },
    { symbol: 'DOGE', name: 'Dogecoin', icon: '🐶' },
    { symbol: 'SOL', name: 'Solana', icon: '🌞' },
    { symbol: 'ADA', name: 'Cardano', icon: '💠' },
    { symbol: 'TRX', name: 'TRON', icon: '🔺' },
    { symbol: 'MATIC', name: 'Polygon', icon: '🔷' },
    { symbol: 'DOT', name: 'Polkadot', icon: '🟣' },
    { symbol: 'LINK', name: 'Chainlink', icon: '🔗' },
    { symbol: 'LTC', name: 'Litecoin', icon: '💡' },
    { symbol: 'UNI', name: 'Uniswap', icon: '🦄' },
    { symbol: 'XLM', name: 'Stellar', icon: '✨' },
    { symbol: 'TON', name: 'Toncoin', icon: '🪙' },
    { symbol: 'AVAX', name: 'Avalanche', icon: '❄️' },
    { symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕' },
    { symbol: 'ATOM', name: 'Cosmos', icon: '⚛️' },
    { symbol: 'NEAR', name: 'NEAR Protocol', icon: '🌐' },
    { symbol: 'FTM', name: 'Fantom', icon: '👻' },
    { symbol: 'ALGO', name: 'Algorand', icon: '🔷' },
    { symbol: 'VET', name: 'VeChain', icon: '🔗' },
    { symbol: 'FIL', name: 'Filecoin', icon: '📁' },
    { symbol: 'ICP', name: 'Internet Computer', icon: '🌐' },
    { symbol: 'APT', name: 'Aptos', icon: '🟢' },
    { symbol: 'ARB', name: 'Arbitrum', icon: '🔵' },
    { symbol: 'OP', name: 'Optimism', icon: '🟠' },
    { symbol: 'MKR', name: 'Maker', icon: '🏛️' },
    { symbol: 'AAVE', name: 'Aave', icon: '📈' },
    { symbol: 'SNX', name: 'Synthetix', icon: '📊' },
    { symbol: 'COMP', name: 'Compound', icon: '🏦' },
    { symbol: 'YFI', name: 'yearn.finance', icon: '🎯' },
    { symbol: 'CRV', name: 'Curve DAO', icon: '🔄' },
    { symbol: 'BAL', name: 'Balancer', icon: '⚖️' },
    { symbol: 'SUSHI', name: 'SushiSwap', icon: '🍣' },
    { symbol: '1INCH', name: '1inch', icon: '🔗' },
    { symbol: 'ZRX', name: '0x Protocol', icon: '🔄' },
    { symbol: 'BAT', name: 'Basic Attention Token', icon: '🦁' },
    { symbol: 'ZEC', name: 'Zcash', icon: '🛡️' },
    { symbol: 'DASH', name: 'Dash', icon: '💎' },
    { symbol: 'XMR', name: 'Monero', icon: '🔒' },
    { symbol: 'EOS', name: 'EOS', icon: '⚡' },
    { symbol: 'XTZ', name: 'Tezos', icon: '🍞' },
    { symbol: 'NEO', name: 'Neo', icon: '🐉' },
    { symbol: 'WAVES', name: 'Waves', icon: '🌊' },
    { symbol: 'IOTA', name: 'IOTA', icon: '📡' },
    { symbol: 'NANO', name: 'Nano', icon: '⚡' },
    { symbol: 'HBAR', name: 'Hedera', icon: '🌿' },
    { symbol: 'THETA', name: 'Theta Network', icon: '🎬' },
    { symbol: 'CAKE', name: 'PancakeSwap', icon: '🥞' },
    { symbol: 'CHZ', name: 'Chiliz', icon: '⚽' },
    { symbol: 'HOT', name: 'Holo', icon: '🔥' },
    { symbol: 'ENJ', name: 'Enjin Coin', icon: '🎮' },
    { symbol: 'MANA', name: 'Decentraland', icon: '🏗️' },
    { symbol: 'SAND', name: 'The Sandbox', icon: '🏖️' },
    { symbol: 'AXS', name: 'Axie Infinity', icon: '🎮' },
    { symbol: 'GALA', name: 'Gala', icon: '🎭' },
    { symbol: 'ROBLOX', name: 'Roblox', icon: '🎮' },
    { symbol: 'RUNE', name: 'THORChain', icon: '⚡' },
    { symbol: 'KSM', name: 'Kusama', icon: '🟡' },
    { symbol: 'GRT', name: 'The Graph', icon: '📊' },
    { symbol: 'OCEAN', name: 'Ocean Protocol', icon: '🌊' },
    { symbol: 'BAND', name: 'Band Protocol', icon: '🎵' },
    { symbol: 'ANKR', name: 'Ankr', icon: '🔗' },
    { symbol: 'STORJ', name: 'Storj', icon: '☁️' },
    { symbol: 'SKL', name: 'Skale', icon: '⚡' },
    { symbol: 'COTI', name: 'COTI', icon: '💳' },
    { symbol: 'CELO', name: 'Celo', icon: '📱' },
    { symbol: 'HIVE', name: 'Hive', icon: '🐝' },
    { symbol: 'STEEM', name: 'Steem', icon: '📝' },
    { symbol: 'HBD', name: 'Hive Dollar', icon: '💵' },
    { symbol: 'SBD', name: 'Steem Dollar', icon: '💵' }
  ];

  const state = {
    prices: {}, // symbol -> { price, change24h }
    filterText: '',
    sortKey: 'market', // market, price-asc, price-desc, change-asc, change-desc, name
    selected: null, // symbol
    chart: null,
    lastLive: null,
    favorites: [], // user's favorite coins
    portfolio: {}, // user's portfolio holdings
    priceAlerts: {}, // user's price alerts
    viewMode: 'grid', // grid or list view
  };

  function $(sel){ return document.querySelector(sel); }
  function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

  function getSymbols(){ return COINS.map(c => c.symbol).join(','); }

  async function fetchLive(){
    const url = `${API_BASE}/live?access_key=${ACCESS_KEY}&symbols=${encodeURIComponent(getSymbols())}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('live fetch failed');
    const data = await res.json();
    if (!data || data.success === false) throw new Error(data.error?.info || 'live fetch error');
    state.lastLive = data.rates || {};
    return state.lastLive;
  }

  function ymd(d){ return d.toISOString().slice(0,10); }

  async function fetchChange24h(){
    try {
      const now = new Date();
      const start = new Date(now.getTime() - 24*60*60*1000);
      const url = `${API_BASE}/change?access_key=${ACCESS_KEY}&symbols=${encodeURIComponent(getSymbols())}&start_date=${ymd(start)}&end_date=${ymd(now)}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('change fetch failed');
      const data = await res.json();
      if (!data || data.success === false) throw new Error(data.error?.info || 'change fetch error');
      return data.change || {};
    } catch (e) {
      return null;
    }
  }

  async function refreshData(showSpinner = false){
    if (showSpinner) toggleLoading(true);
    try {
      const [live, change] = await Promise.all([fetchLive(), fetchChange24h()]);
      COINS.forEach(c => {
        const price = Number(live[c.symbol]);
        let changePct = null;
        if (change && change[c.symbol]) {
          const ch = change[c.symbol];
          if (ch && typeof ch.change_pct !== 'undefined') changePct = Number(ch.change_pct);
          else if (ch && ch.start_rate && ch.end_rate) {
            changePct = ((ch.end_rate - ch.start_rate) / ch.start_rate) * 100;
          }
        }
        state.prices[c.symbol] = { price, change24h: changePct };
      });
      render();
      checkPriceAlerts(); // Check for triggered alerts
    } catch (e) {
      showError('Unable to fetch crypto data.');
    } finally {
      if (showSpinner) toggleLoading(false);
    }
  }

  function toggleLoading(on){
    const el = $('#crypto-loading');
    if (!el) return;
    el.style.display = on ? 'flex' : 'none';
  }

  function showError(msg){
    const el = $('#crypto-error');
    if (!el) return;
    el.style.display = 'block';
    el.querySelector('.error-message').textContent = msg;
  }

  // Safe client-side features
  function loadUserData() {
    try {
      state.favorites = JSON.parse(localStorage.getItem('crypto-favorites') || '[]');
      state.portfolio = JSON.parse(localStorage.getItem('crypto-portfolio') || '{}');
      state.priceAlerts = JSON.parse(localStorage.getItem('crypto-alerts') || '{}');
      state.viewMode = localStorage.getItem('crypto-view-mode') || 'grid';
    } catch (e) {
      console.error('Error loading user data:', e);
    }
  }

  function saveUserData() {
    try {
      localStorage.setItem('crypto-favorites', JSON.stringify(state.favorites));
      localStorage.setItem('crypto-portfolio', JSON.stringify(state.portfolio));
      localStorage.setItem('crypto-alerts', JSON.stringify(state.priceAlerts));
      localStorage.setItem('crypto-view-mode', state.viewMode);
    } catch (e) {
      console.error('Error saving user data:', e);
    }
  }

  function toggleFavorite(symbol) {
    const index = state.favorites.indexOf(symbol);
    if (index > -1) {
      state.favorites.splice(index, 1);
    } else {
      state.favorites.push(symbol);
    }
    saveUserData();
    render();
  }

  function isFavorite(symbol) {
    return state.favorites.includes(symbol);
  }

  function addToPortfolio(symbol, amount) {
    if (!state.portfolio[symbol]) {
      state.portfolio[symbol] = 0;
    }
    state.portfolio[symbol] += parseFloat(amount) || 0;
    saveUserData();
    render();
  }

  function getPortfolioValue() {
    let total = 0;
    for (const [symbol, amount] of Object.entries(state.portfolio)) {
      const price = state.prices[symbol]?.price || 0;
      total += amount * price;
    }
    return total;
  }

  function setPriceAlert(symbol, targetPrice, type = 'above') {
    if (!state.priceAlerts[symbol]) {
      state.priceAlerts[symbol] = [];
    }
    state.priceAlerts[symbol].push({
      id: Date.now(),
      targetPrice: parseFloat(targetPrice),
      type: type,
      active: true
    });
    saveUserData();
    showToast(`Alert set for ${symbol} at $${targetPrice}`);
  }

  function checkPriceAlerts() {
    for (const [symbol, alerts] of Object.entries(state.priceAlerts)) {
      const currentPrice = state.prices[symbol]?.price || 0;
      alerts.forEach(alert => {
        if (!alert.active) return;
        
        let triggered = false;
        if (alert.type === 'above' && currentPrice >= alert.targetPrice) {
          triggered = true;
        } else if (alert.type === 'below' && currentPrice <= alert.targetPrice) {
          triggered = true;
        }
        
        if (triggered) {
          alert.active = false;
          showToast(`${symbol} reached $${alert.targetPrice}!`, 'alert');
        }
      });
    }
    saveUserData();
  }

  function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.crypto-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `crypto-toast ${type}`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
      <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: ${type === 'success' ? '#10b981' : '#f59e0b'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      animation: slideIn 0.3s ease;
      max-width: 300px;
    `;
    
    // Add animation styles if not already present
    if (!document.querySelector('#crypto-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'crypto-toast-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
      }).catch(() => {
        fallbackCopyTextToClipboard(text);
      });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  }

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showToast('Copied to clipboard!');
    } catch (err) {
      console.error('Copy failed:', err);
      showToast('Copy failed - please copy manually', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  function fmtPrice(v){
    if (v == null || isNaN(v)) return '—';
    if (v >= 1000) return `$${v.toLocaleString(undefined,{maximumFractionDigits:2})}`;
    return `$${v.toFixed(4)}`;
  }
  function fmtPct(p){
    if (p == null || isNaN(p)) return '—';
    const s = p.toFixed(2) + '%';
    return s;
  }

  function coinInfo(symbol){ return COINS.find(c => c.symbol === symbol); }

  function cardGradient(change){
    if (change == null) return '';
    if (change > 2) return 'trending';
    if (change < -2) return 'falling';
    return '';
  }

  function getFilteredSorted(){
    const text = state.filterText.trim().toLowerCase();
    let list = COINS.filter(c =>
      c.symbol.toLowerCase().includes(text) || c.name.toLowerCase().includes(text)
    ).map(c => ({...c, ...state.prices[c.symbol]}));

    const key = state.sortKey;
    if (key === 'price-asc') list.sort((a,b) => (a.price||0)-(b.price||0));
    else if (key === 'price-desc') list.sort((a,b) => (b.price||0)-(a.price||0));
    else if (key === 'change-asc') list.sort((a,b) => (a.change24h||-1e9)-(b.change24h||-1e9));
    else if (key === 'change-desc') list.sort((a,b) => (b.change24h||-1e9)-(a.change24h||-1e9));
    else if (key === 'name') list.sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }

  function render(){
    renderCards();
    renderStats();
  }

  function renderStats(){
    const liveCount = COINS.length;
    const totalMkt = getFilteredSorted().reduce((sum,c)=> sum + (c.price||0), 0);
    const portfolioValue = getPortfolioValue();
    const favoritesCount = state.favorites.length;
    
    const liveEl = $('#stat-count');
    const mktEl = $('#stat-sum');
    if (liveEl) liveEl.textContent = String(liveCount);
    if (mktEl) mktEl.textContent = `$${Math.round(totalMkt).toLocaleString()}`;
    
    // Update or create portfolio stats
    let portfolioEl = $('#stat-portfolio');
    if (!portfolioEl) {
      const statsContainer = $('.stats');
      if (statsContainer) {
        statsContainer.innerHTML += `
          <div class="stat">
            <span>Portfolio: <strong id="stat-portfolio">$${portfolioValue.toFixed(2)}</strong></span>
          </div>
          <div class="stat">
            <span>Favorites: <strong id="stat-favorites">${favoritesCount}</strong></span>
          </div>
        `;
        portfolioEl = $('#stat-portfolio');
      }
    } else {
      portfolioEl.textContent = `$${portfolioValue.toFixed(2)}`;
    }
    
    // Update favorites count
    const favoritesEl = $('#stat-favorites');
    if (favoritesEl) {
      favoritesEl.textContent = String(favoritesCount);
    }
  }

  function renderCards(){
    const grid = $('#coin-grid');
    if (!grid) return;
    const list = getFilteredSorted();
    grid.innerHTML = list.map(c => {
      const pct = c.change24h;
      const signClass = pct == null ? '' : (pct >= 0 ? 'pos' : 'neg');
      const grad = cardGradient(pct);
      const isFav = isFavorite(c.symbol);
      const portfolioAmount = state.portfolio[c.symbol] || 0;
      const portfolioValue = portfolioAmount * (c.price || 0);
      
      return `
      <div class="coin-card ${grad}" data-symbol="${c.symbol}">
        <div class="coin-top">
          <div class="coin-icon">${c.icon}</div>
          <div class="coin-meta">
            <div class="coin-name">${c.name}</div>
            <div class="coin-symbol">${c.symbol}</div>
            ${portfolioAmount > 0 ? `<div class="portfolio-info">You own: ${portfolioAmount.toFixed(4)} ($${portfolioValue.toFixed(2)})</div>` : ''}
          </div>
          <div class="coin-actions">
            <button class="coin-favorite-btn ${isFav ? 'favorited' : ''}" data-symbol="${c.symbol}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
              <i class="fas fa-heart"></i>
            </button>
            <button class="coin-chart-btn" data-symbol="${c.symbol}" title="View chart">
              <i class="fas fa-chart-line"></i>
            </button>
            <button class="coin-more-btn" data-symbol="${c.symbol}" title="More actions">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
        <div class="coin-bottom">
          <div class="coin-price">${fmtPrice(c.price)}</div>
          <div class="coin-change ${signClass}">${fmtPct(pct)}</div>
        </div>
        <div class="coin-actions-menu" id="menu-${c.symbol}" style="display: none;">
          <button class="action-btn" onclick="addToPortfolio('${c.symbol}', prompt('Enter amount of ${c.symbol} to add:'))">
            <i class="fas fa-plus"></i> Add to Portfolio
          </button>
          <button class="action-btn" onclick="setPriceAlert('${c.symbol}', prompt('Enter target price for ${c.symbol}:'))">
            <i class="fas fa-bell"></i> Set Price Alert
          </button>
          <button class="action-btn" onclick="copyToClipboard('${c.symbol}: ${fmtPrice(c.price)}')">
            <i class="fas fa-copy"></i> Copy Price
          </button>
          <button class="action-btn" onclick="copyToClipboard('${c.symbol} price: ${fmtPrice(c.price)} - Check it out on Brightlens News!')">
            <i class="fas fa-share"></i> Share
          </button>
        </div>
      </div>`;
    }).join('');

    // Bind card interactions
    $all('.coin-card').forEach(el => {
      const symbol = el.getAttribute('data-symbol');
      
      // Chart button
      el.querySelector('.coin-chart-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openChart(symbol);
      });
      
      // Favorite button
      el.querySelector('.coin-favorite-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(symbol);
      });
      
      // More actions button
      el.querySelector('.coin-more-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = el.querySelector('.coin-actions-menu');
        const allMenus = $all('.coin-actions-menu');
        allMenus.forEach(m => m.style.display = 'none');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      });
    });
    
    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.coin-actions-menu') && !e.target.closest('.coin-more-btn')) {
        $all('.coin-actions-menu').forEach(menu => menu.style.display = 'none');
      }
    });
  }

  // Chart
  function getRangePoints(range){
    if (range === '1h') return 60;
    if (range === '7d') return 7;
    return 24; // 24h
  }
  function genMockSeries(price, n){
    const arr = [];
    for (let i=0;i<n;i++){ arr.push(price * (1 + (Math.sin(i/3)/50) + (Math.random()-0.5)/50)); }
    return arr;
  }
  async function loadSeries(symbol, range){
    // Coinlayer has timeframe endpoint but daily resolution; we'll mock if not available
    const price = state.prices[symbol]?.price || 0;
    const n = getRangePoints(range);
    const series = genMockSeries(price, n);
    const labels = Array.from({length:n}, (_,i)=> i+1);
    return { labels, series };
  }
  async function openChart(symbol){
    state.selected = symbol;
    const panel = $('#chart-panel');
    const title = $('#chart-title');
    title.textContent = `${symbol} • ${coinInfo(symbol)?.name || ''}`;
    panel.style.display = 'block';
    await renderChart('24h');
    panel.scrollIntoView({ behavior: 'smooth' });
  }
  async function renderChart(range){
    const canvas = $('#chart-canvas');
    const ctx = canvas.getContext('2d');
    const { labels, series } = await loadSeries(state.selected, range);
    if (state.chart) { state.chart.destroy(); }
    state.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${state.selected} ${range}`,
          data: series,
          borderColor: 'var(--primary-color)'.replace('var(--primary-color)', getComputedStyle(document.body).getPropertyValue('--primary-color').trim() || '#2563eb'),
          backgroundColor: 'rgba(37,99,235,0.2)',
          tension: 0.3,
          pointRadius: 0,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: true, ticks: { callback: v => `$${v}` } } }
      }
    });
  }

  // UI bindings
  function bindControls(){
    const search = $('#coin-search');
    const sort = $('#coin-sort');
    const refreshBtn = $('#refresh-now');
    const ranges = $all('[data-range]');
    const closeChart = $('#chart-close');

    search.addEventListener('input', () => {
      state.filterText = search.value;
      render();
    });
    sort.addEventListener('change', () => {
      state.sortKey = sort.value;
      render();
    });
    refreshBtn.addEventListener('click', () => refreshData(true));
    ranges.forEach(btn => btn.addEventListener('click', async () => {
      const r = btn.getAttribute('data-range');
      await renderChart(r);
      ranges.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }));
    closeChart.addEventListener('click', () => {
      $('#chart-panel').style.display = 'none';
      state.selected = null;
    });
  }

  function startAutoRefresh(){
    setInterval(() => refreshData(false), REFRESH_MS);
  }

  function hideSplashScreen(){
    const screen = document.getElementById('loading-screen');
    if (!screen) return;
    screen.classList.add('hidden');
    setTimeout(() => { screen.style.display = 'none'; }, 300);
  }

  function applySavedThemeEarly(){
    try {
      if (window.themeManager?.getCurrentTheme) {
        const t = localStorage.getItem('brightlens-theme') || localStorage.getItem('selectedTheme') || 'default';
        if (t && t !== 'default') document.body.setAttribute('data-theme', t);
      }
    } catch (_) {}
  }

  document.addEventListener('DOMContentLoaded', async () => {
    applySavedThemeEarly();
    loadUserData(); // Load user preferences and data
    bindControls();
    // Start initial data load and show in-page loading indicator
    await refreshData(true);
    // Hide page splash once content is ready (match behavior on other categories)
    setTimeout(hideSplashScreen, 200);
    startAutoRefresh();
  });
})();