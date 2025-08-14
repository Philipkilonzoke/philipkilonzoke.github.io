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
    { symbol: 'TON', name: 'Toncoin', icon: '🪙' }
  ];

  const state = {
    prices: {}, // symbol -> { price, change24h }
    filterText: '',
    sortKey: 'market', // market, price-asc, price-desc, change-asc, change-desc, name
    selected: null, // symbol
    chart: null,
    lastLive: null,
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
    const liveEl = $('#stat-count');
    const mktEl = $('#stat-sum');
    if (liveEl) liveEl.textContent = String(liveCount);
    if (mktEl) mktEl.textContent = `$${Math.round(totalMkt).toLocaleString()}`;
  }

  function renderCards(){
    const grid = $('#coin-grid');
    if (!grid) return;
    const list = getFilteredSorted();
    grid.innerHTML = list.map(c => {
      const pct = c.change24h;
      const signClass = pct == null ? '' : (pct >= 0 ? 'pos' : 'neg');
      const grad = cardGradient(pct);
      return `
      <div class="coin-card ${grad}" data-symbol="${c.symbol}">
        <div class="coin-top">
          <div class="coin-icon">${c.icon}</div>
          <div class="coin-meta">
            <div class="coin-name">${c.name}</div>
            <div class="coin-symbol">${c.symbol}</div>
          </div>
          <button class="coin-chart-btn" data-symbol="${c.symbol}"><i class="fas fa-chart-line"></i></button>
        </div>
        <div class="coin-bottom">
          <div class="coin-price">${fmtPrice(c.price)}</div>
          <div class="coin-change ${signClass}">${fmtPct(pct)}</div>
        </div>
      </div>`;
    }).join('');

    // Bind card clicks to open chart
    $all('.coin-card, .coin-chart-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        const symbol = el.getAttribute('data-symbol') || el.closest('.coin-card')?.getAttribute('data-symbol');
        if (symbol) openChart(symbol);
      });
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
          borderColor: '#2563eb',
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

  document.addEventListener('DOMContentLoaded', async () => {
    bindControls();
    // Start initial data load and show in-page loading indicator
    await refreshData(true);
    // Hide page splash once content is ready (match behavior on other categories)
    setTimeout(hideSplashScreen, 200);
    startAutoRefresh();
  });
})();