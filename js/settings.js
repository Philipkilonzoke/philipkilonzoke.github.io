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
          <select id="language-select" style="width:100%; padding:0.5rem; border:1px solid var(--border-color); border-radius:0.5rem; background:#fff;"></select>
        </section>

        <section class="settings-section" id="settings-privacy">
          <h4>Privacy</h4>
          <div style="display:grid; gap:0.5rem;">
            <label class="toggle"><input type="checkbox" id="cookies-toggle" /> Allow Cookies</label>
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
      { id: 'dark', name: 'Dark (Default)' },
      { id: 'light', name: 'Light' },
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
    return document.body.getAttribute('data-theme') || 'dark';
}
  function setTheme(themeId) {
    if (window.themeManager?.setTheme) {
      window.themeManager.setTheme(themeId);
    } else {
      // Fallback
      document.body.removeAttribute('data-theme');
      if (themeId !== 'dark') document.body.setAttribute('data-theme', themeId);
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
  function bindOneSignalSubscriptionObserver() {
    if (!window.OneSignalDeferred) return;
    window.OneSignalDeferred.push(function(OneSignal) {
      try {
        OneSignal.User.PushSubscription.addEventListener('change', async () => {
          const toggle = document.getElementById('notifications-toggle');
          if (!toggle) return;
          const optedIn = await OneSignal.User.PushSubscription.optedIn;
          toggle.checked = !!optedIn;
          setNotifStatus(optedIn ? 'Notifications enabled' : 'Notifications disabled');
        });
      } catch (e) {
        /* ignore */
      }
    });
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
          bindOneSignalSubscriptionObserver();
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

  // === Language (50+ via Google Translate widget control) ===
  const SUPPORTED_LANGUAGES = [
    { code: 'af', name: 'Afrikaans' }, { code: 'sq', name: 'Albanian' },
    { code: 'am', name: 'Amharic' }, { code: 'ar', name: 'Arabic' },
    { code: 'hy', name: 'Armenian' }, { code: 'az', name: 'Azerbaijani' },
    { code: 'eu', name: 'Basque' }, { code: 'be', name: 'Belarusian' },
    { code: 'bn', name: 'Bengali' }, { code: 'bs', name: 'Bosnian' },
    { code: 'bg', name: 'Bulgarian' }, { code: 'ca', name: 'Catalan' },
    { code: 'ceb', name: 'Cebuano' }, { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' }, { code: 'co', name: 'Corsican' },
    { code: 'hr', name: 'Croatian' }, { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' }, { code: 'nl', name: 'Dutch' },
    { code: 'en', name: 'English' }, { code: 'eo', name: 'Esperanto' },
    { code: 'et', name: 'Estonian' }, { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' }, { code: 'fy', name: 'Frisian' },
    { code: 'gl', name: 'Galician' }, { code: 'ka', name: 'Georgian' },
    { code: 'de', name: 'German' }, { code: 'el', name: 'Greek' },
    { code: 'gu', name: 'Gujarati' }, { code: 'ht', name: 'Haitian Creole' },
    { code: 'ha', name: 'Hausa' }, { code: 'haw', name: 'Hawaiian' },
    { code: 'he', name: 'Hebrew' }, { code: 'hi', name: 'Hindi' },
    { code: 'hmn', name: 'Hmong' }, { code: 'hu', name: 'Hungarian' },
    { code: 'is', name: 'Icelandic' }, { code: 'ig', name: 'Igbo' },
    { code: 'id', name: 'Indonesian' }, { code: 'ga', name: 'Irish' },
    { code: 'it', name: 'Italian' }, { code: 'ja', name: 'Japanese' },
    { code: 'jw', name: 'Javanese' }, { code: 'kn', name: 'Kannada' },
    { code: 'kk', name: 'Kazakh' }, { code: 'km', name: 'Khmer' },
    { code: 'rw', name: 'Kinyarwanda' }, { code: 'ko', name: 'Korean' },
    { code: 'ku', name: 'Kurdish' }, { code: 'ky', name: 'Kyrgyz' },
    { code: 'lo', name: 'Lao' }, { code: 'la', name: 'Latin' },
    { code: 'lv', name: 'Latvian' }, { code: 'lt', name: 'Lithuanian' },
    { code: 'lb', name: 'Luxembourgish' }, { code: 'mk', name: 'Macedonian' },
    { code: 'mg', name: 'Malagasy' }, { code: 'ms', name: 'Malay' },
    { code: 'ml', name: 'Malayalam' }, { code: 'mt', name: 'Maltese' },
    { code: 'mi', name: 'Maori' }, { code: 'mr', name: 'Marathi' },
    { code: 'mn', name: 'Mongolian' }, { code: 'my', name: 'Myanmar (Burmese)' },
    { code: 'ne', name: 'Nepali' }, { code: 'no', name: 'Norwegian' },
    { code: 'ny', name: 'Nyanja (Chichewa)' }, { code: 'or', name: 'Odia (Oriya)' },
    { code: 'ps', name: 'Pashto' }, { code: 'fa', name: 'Persian' },
    { code: 'pl', name: 'Polish' }, { code: 'pt', name: 'Portuguese' },
    { code: 'pa', name: 'Punjabi' }, { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' }, { code: 'sm', name: 'Samoan' },
    { code: 'gd', name: 'Scots Gaelic' }, { code: 'sr', name: 'Serbian' },
    { code: 'st', name: 'Sesotho' }, { code: 'sn', name: 'Shona' },
    { code: 'sd', name: 'Sindhi' }, { code: 'si', name: 'Sinhala' },
    { code: 'sk', name: 'Slovak' }, { code: 'sl', name: 'Slovenian' },
    { code: 'so', name: 'Somali' }, { code: 'es', name: 'Spanish' },
    { code: 'su', name: 'Sundanese' }, { code: 'sw', name: 'Swahili' },
    { code: 'sv', name: 'Swedish' }, { code: 'tl', name: 'Tagalog (Filipino)' },
    { code: 'tg', name: 'Tajik' }, { code: 'ta', name: 'Tamil' },
    { code: 'tt', name: 'Tatar' }, { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' }, { code: 'tr', name: 'Turkish' },
    { code: 'tk', name: 'Turkmen' }, { code: 'uk', name: 'Ukrainian' },
    { code: 'ur', name: 'Urdu' }, { code: 'ug', name: 'Uyghur' },
    { code: 'uz', name: 'Uzbek' }, { code: 'vi', name: 'Vietnamese' },
    { code: 'cy', name: 'Welsh' }, { code: 'xh', name: 'Xhosa' },
    { code: 'yi', name: 'Yiddish' }, { code: 'yo', name: 'Yoruba' },
    { code: 'zu', name: 'Zulu' }
  ];

  function populateLanguages() {
    const select = document.getElementById('language-select');
    if (!select) return;
    select.innerHTML = '';
    SUPPORTED_LANGUAGES.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.code;
      opt.textContent = l.name;
      select.appendChild(opt);
    });
  }

  function ensureGoogleTranslate() {
    if (window.__bl_gtranslate_initialized) return;
    window.__bl_gtranslate_initialized = true;

    // Hidden container for Google Translate element
    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    }

    window.googleTranslateElementInit = function () {
      // eslint-disable-next-line no-undef
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false,
        includedLanguages: SUPPORTED_LANGUAGES.map(l => l.code).join(',')
      }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  }

  function setGoogleTranslateCookie(key, value) {
    document.cookie = key + '=' + value + '; path=/; expires=' + new Date(Date.now() + 365*24*60*60*1000).toUTCString();
  }

  function applyLanguage(langCode) {
    // Save selection
    localStorage.setItem('bl-language', langCode);
    document.documentElement.setAttribute('lang', langCode);

    // Use Google Translate site-wide
    ensureGoogleTranslate();
    // Set both auto and en source to improve reliability
    setGoogleTranslateCookie('googtrans', `/auto/${langCode}`);
    setGoogleTranslateCookie('googtrans', `/en/${langCode}`);

    // Soft reload to let Google Translate re-render fully
    setTimeout(() => {
      try {
        if (typeof google !== 'undefined' && google.translate) {
          // Trigger re-translate without full reload if possible
          const frame = document.querySelector('iframe.goog-te-menu-frame');
          if (!frame) {
            location.reload();
          }
        } else {
          location.reload();
        }
      } catch (_) {
        location.reload();
      }
    }, 200);
  }

  function initLanguage() {
    populateLanguages();
    const select = document.getElementById('language-select');
    if (!select) return;

    const saved = localStorage.getItem('bl-language') || 'en';
    select.value = saved;
    // Apply immediately for consistency across pages
    if (saved && saved !== 'en') {
      ensureGoogleTranslate();
      setGoogleTranslateCookie('googtrans', `/en/${saved}`);
      document.documentElement.setAttribute('lang', saved);
    }

    select.addEventListener('change', () => applyLanguage(select.value));
  }

  // === Privacy (cookies toggle only) ===
  function initPrivacy() {
    const cookiesToggle = document.getElementById('cookies-toggle');
    const cookies = localStorage.getItem('bl-cookies-allowed');
    if (cookiesToggle) {
      cookiesToggle.checked = cookies === 'true';
      cookiesToggle.addEventListener('change', () => {
        localStorage.setItem('bl-cookies-allowed', cookiesToggle.checked ? 'true' : 'false');
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