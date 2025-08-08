/* Settings System for Brightlens News */
(function () {
  const SETTINGS_ID = 'settings-toggle';
  const PANEL_ID = 'settings-panel';
  const BACKDROP_ID = 'settings-backdrop';

  function ensureStylesheet() {
    // Inject settings.css if not already present
    const has = Array.from(document.styleSheets).some(s => (s.href || '').includes('/css/settings.css'));
    if (!has) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/settings.css';
      document.head.appendChild(link);
    }
  }

  function createToggleButton() {
    // Avoid duplicates
    if (document.getElementById(SETTINGS_ID)) return;

    // Place between theme-toggle and mobile-menu-toggle
    const navControls = document.querySelector('.nav-controls');
    if (!navControls) return;

    const btn = document.createElement('button');
    btn.id = SETTINGS_ID;
    btn.className = 'settings-toggle';
    btn.title = 'Settings';
    btn.setAttribute('aria-label', 'Settings');
    btn.innerHTML = '<i class="fas fa-gear"></i>';

    // Insert after theme-toggle
    const themeBtn = navControls.querySelector('#theme-toggle');
    if (themeBtn && themeBtn.nextSibling) {
      themeBtn.parentNode.insertBefore(btn, themeBtn.nextSibling);
    } else if (themeBtn) {
      navControls.appendChild(btn);
    } else {
      navControls.appendChild(btn);
    }

    btn.addEventListener('click', openPanel);
  }

  function openPanel() {
    const backdrop = getOrCreateBackdrop();
    const panel = getOrCreatePanel();
    backdrop.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePanel() {
    const backdrop = document.getElementById(BACKDROP_ID);
    const panel = document.getElementById(PANEL_ID);
    backdrop?.classList.remove('open');
    panel?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function getOrCreateBackdrop() {
    let el = document.getElementById(BACKDROP_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = BACKDROP_ID;
      el.className = 'settings-backdrop';
      el.addEventListener('click', closePanel);
      document.body.appendChild(el);
    }
    return el;
  }

  function getOrCreatePanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    panel = document.createElement('aside');
    panel.id = PANEL_ID;
    panel.className = 'settings-panel';
    panel.innerHTML = `
      <div class="settings-header">
        <h3><i class="fas fa-gear"></i> Settings</h3>
        <button class="settings-close" id="settings-close" aria-label="Close"><i class="fas fa-xmark"></i></button>
      </div>
      <div class="settings-body">
        <section class="settings-section" id="settings-theme">
          <h4>Theme</h4>
          <div class="theme-grid-inline" id="settings-theme-grid"></div>
        </section>

        <section class="settings-section" id="settings-font">
          <h4>Font Size</h4>
          <div class="font-size-options">
            <button class="font-size-btn" data-size="small">Small</button>
            <button class="font-size-btn" data-size="medium">Medium</button>
            <button class="font-size-btn" data-size="large">Large</button>
          </div>
        </section>

        <section class="settings-section" id="settings-notifications">
          <h4>Notifications</h4>
          <label class="toggle"><input type="checkbox" id="notifications-toggle" /> Enable push notifications</label>
          <div id="notifications-status" style="margin-top:0.5rem; font-size:0.9rem; color:var(--text-muted);"></div>
        </section>

        <section class="settings-section" id="settings-language">
          <h4>Language</h4>
          <select id="language-select" style="width:100%; padding:0.5rem; border:1px solid var(--border-color); border-radius:0.5rem; background:#fff;">
            <option value="en">English</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
          </select>
          <div style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-muted);">Experimental: basic UI text changes only.</div>
        </section>

        <section class="settings-section" id="settings-privacy">
          <h4>Privacy</h4>
          <div style="display:grid; gap:0.5rem;">
            <label class="toggle"><input type="checkbox" id="cookies-toggle" /> Allow Cookies</label>
            <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="tos-check" /> I agree to Terms of Service</label>
          </div>
        </section>

        <section class="settings-section" id="settings-contact">
          <h4>Contact Us</h4>
          <a href="https://wa.me/254791943551" target="_blank" rel="noopener" class="cta" style="display:inline-flex; align-items:center; gap:0.5rem; text-decoration:none;">
            <i class="fab fa-whatsapp"></i> Chat on WhatsApp
          </a>
        </section>

        <section class="settings-section" id="settings-about">
          <h4>About Brightlens News</h4>
          <p style="margin:0; color:var(--text-muted);">Brightlens News was created to provide real-time, trusted updates across the globe. Stay informed with tech, business, entertainment, and more.</p>
        </section>
      </div>
      <div class="settings-footer">
        <div style="font-size:0.85rem; color:var(--text-muted);">Your preferences are saved automatically</div>
        <button class="cta" id="settings-done">Done</button>
      </div>
    `;

    document.body.appendChild(panel);

    // Close handlers
    panel.querySelector('#settings-close')?.addEventListener('click', closePanel);
    panel.querySelector('#settings-done')?.addEventListener('click', closePanel);

    // Populate and wire features
    populateThemeChips();
    initFontSize();
    initNotifications();
    initLanguage();
    initPrivacy();

    return panel;
  }

  // === Theme duplication (using window.themeManager if available) ===
  function getThemes() {
    if (window.themeManager?.getThemes) return window.themeManager.getThemes();
    // Fallback minimal set
    return [
      { id: 'default', name: 'Default' },
      { id: 'dark', name: 'Dark' },
      { id: 'blue', name: 'Blue' },
      { id: 'green', name: 'Green' },
      { id: 'purple', name: 'Purple' },
      { id: 'orange', name: 'Orange' },
      { id: 'rose', name: 'Rose' },
      { id: 'emerald', name: 'Emerald' },
      { id: 'indigo', name: 'Indigo' },
      { id: 'amber', name: 'Amber' },
      { id: 'teal', name: 'Teal' },
      { id: 'crimson', name: 'Crimson' },
    ];
  }
  function getCurrentTheme() {
    if (window.themeManager?.getCurrentTheme) return window.themeManager.getCurrentTheme();
    return document.body.getAttribute('data-theme') || 'default';
  }
  function setTheme(themeId) {
    if (window.themeManager?.setTheme) {
      window.themeManager.setTheme(themeId);
    } else {
      // Fallback
      document.body.removeAttribute('data-theme');
      if (themeId !== 'default') document.body.setAttribute('data-theme', themeId);
      localStorage.setItem('brightlens-theme', themeId);
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeId } }));
    }
  }
  function populateThemeChips() {
    const container = document.getElementById('settings-theme-grid');
    if (!container) return;
    container.innerHTML = '';
    const current = getCurrentTheme();
    getThemes().forEach(t => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'theme-chip' + (t.id === current ? ' active' : '');
      chip.dataset.theme = t.id;
      chip.innerHTML = `<span class="swatch" style="background: var(--primary-color);"></span><span>${t.name}</span>`;
      chip.addEventListener('click', () => {
        setTheme(t.id);
        // Refresh active state
        container.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
      container.appendChild(chip);
    });
  }

  // === Font size ===
  function applyFontSize(size) {
    document.body.classList.remove('fs-small', 'fs-medium', 'fs-large');
    document.body.classList.add(`fs-${size}`);
    localStorage.setItem('bl-font-size', size);
  }
  function initFontSize() {
    const saved = localStorage.getItem('bl-font-size') || 'medium';
    applyFontSize(saved);
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      if (btn.dataset.size === saved) btn.classList.add('active');
      btn.addEventListener('click', () => {
        document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFontSize(btn.dataset.size);
      });
    });
  }

  // === Notifications (OneSignal v16) ===
  function setNotifStatus(text) {
    const el = document.getElementById('notifications-status');
    if (el) el.textContent = text;
  }
  function initNotifications() {
    const toggle = document.getElementById('notifications-toggle');
    if (!toggle) return;

    // Reflect current state when SDK ready
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async function(OneSignal) {
        try {
          const supported = await OneSignal.Notifications.isPushSupported();
          if (!supported) {
            setNotifStatus('Push not supported on this browser/device');
            toggle.disabled = true;
            return;
          }
          const optedIn = await OneSignal.User.PushSubscription.optedIn;
          toggle.checked = !!optedIn;
          setNotifStatus(optedIn ? 'Notifications enabled' : 'Notifications disabled');
        } catch (e) {
          setNotifStatus('Unable to determine notification status');
        }
      });
    }

    toggle.addEventListener('change', async () => {
      setNotifStatus('Please respond to browser prompt if shown...');
      if (!window.OneSignalDeferred) return;
      window.OneSignalDeferred.push(async function(OneSignal) {
        try {
          if (toggle.checked) {
            await OneSignal.Notifications.requestPermission();
            await OneSignal.User.PushSubscription.optIn();
          } else {
            await OneSignal.User.PushSubscription.optOut();
          }
          const optedIn = await OneSignal.User.PushSubscription.optedIn;
          toggle.checked = !!optedIn;
          setNotifStatus(optedIn ? 'Notifications enabled' : 'Notifications disabled');
        } catch (e) {
          console.error('OneSignal toggle error', e);
          setNotifStatus('There was an error changing notification state');
        }
      });
    });
  }

  // === Language (basic demo implementation) ===
  const TRANSLATIONS = {
    en: { explore: 'Explore Now', breaking: 'Breaking News' },
    zh: { explore: '立即探索', breaking: '突发新闻' },
    ja: { explore: '今すぐ探索', breaking: '速報' },
    hi: { explore: 'खोजें', breaking: 'ताज़ा खबर' },
    fr: { explore: 'Explorer', breaking: 'Dernières nouvelles' },
  };
  function applyLanguage(lang) {
    localStorage.setItem('bl-language', lang);
    // Minimal visible updates without full i18n system
    const explore = document.querySelector('.explore-btn');
    if (explore && TRANSLATIONS[lang]?.explore) explore.childNodes[1].nodeValue = ' ' + TRANSLATIONS[lang].explore;
    const breakingBadge = document.querySelector('.breaking-badge');
    if (breakingBadge && TRANSLATIONS[lang]?.breaking) breakingBadge.lastChild.nodeValue = ' ' + TRANSLATIONS[lang].breaking;
  }
  function initLanguage() {
    const select = document.getElementById('language-select');
    if (!select) return;
    const saved = localStorage.getItem('bl-language') || 'en';
    select.value = saved;
    applyLanguage(saved);
    select.addEventListener('change', () => applyLanguage(select.value));
  }

  // === Privacy (dummy toggles) ===
  function initPrivacy() {
    const cookiesToggle = document.getElementById('cookies-toggle');
    const tosCheck = document.getElementById('tos-check');
    const cookies = localStorage.getItem('bl-cookies-allowed');
    const tos = localStorage.getItem('bl-tos-agreed');
    if (cookiesToggle) {
      cookiesToggle.checked = cookies === 'true';
      cookiesToggle.addEventListener('change', () => {
        localStorage.setItem('bl-cookies-allowed', cookiesToggle.checked ? 'true' : 'false');
      });
    }
    if (tosCheck) {
      tosCheck.checked = tos === 'true';
      tosCheck.addEventListener('change', () => {
        localStorage.setItem('bl-tos-agreed', tosCheck.checked ? 'true' : 'false');
      });
    }
  }

  // Initialize when DOM ready
  function init() {
    ensureStylesheet();
    // Wait for header to be present, then insert button
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createToggleButton();
      });
    } else {
      createToggleButton();
    }
  }

  init();
})();