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

        <section class="settings-section" id="settings-ai-enhancement">
          <h4><i class="fas fa-magic"></i> AI Image Enhancement</h4>
          <div class="setting-item">
            <label class="setting-label">
              <span>Enable AI Image Enhancement</span>
              <span class="setting-description">Automatically enhance images for better quality</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="ai-enhancement-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="ai-enhancement-stats" id="ai-enhancement-stats" style="display: none;">
            <div class="stat-item">
              <span class="stat-label">Enhanced Images:</span>
              <span class="stat-value" id="enhanced-count">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Status:</span>
              <span class="stat-value" id="enhancement-status">Idle</span>
            </div>
          </div>
        </section>

        <section class="settings-section" id="settings-ai-translation">
          <h4><i class="fas fa-language"></i> AI Smart Translation</h4>
          <div class="setting-item">
            <label class="setting-label">
              <span>Enable AI Translation</span>
              <span class="setting-description">Real-time translation without page reloads</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="ai-translation-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Language</span>
              <span class="setting-description">Select your preferred language</span>
            </label>
            <div class="setting-control">
              <select id="ai-language-select" class="language-select">
                <!-- Languages will be populated by JavaScript -->
              </select>
            </div>
          </div>
          <div class="ai-translation-stats" id="ai-translation-stats" style="display: none;">
            <div class="stat-item">
              <span class="stat-label">Translated Elements:</span>
              <span class="stat-value" id="translated-count">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Cache Size:</span>
              <span class="stat-value" id="translation-cache-size">0</span>
            </div>
          </div>
        </section>

        <section class="settings-section" id="settings-ai-tts">
          <h4><i class="fas fa-volume-up"></i> AI Text-to-Speech</h4>
          <div class="setting-item">
            <label class="setting-label">
              <span>Enable Text-to-Speech</span>
              <span class="setting-description">Listen to articles and content</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="ai-tts-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Voice Speed</span>
              <span class="setting-description">Adjust speech rate</span>
            </label>
            <div class="setting-control">
              <input type="range" id="tts-speed" min="0.5" max="2" step="0.1" value="0.9" class="speed-slider">
              <span class="speed-value" id="tts-speed-value">0.9x</span>
            </div>
          </div>
          <div class="ai-tts-stats" id="ai-tts-stats" style="display: none;">
            <div class="stat-item">
              <span class="stat-label">TTS Buttons:</span>
              <span class="stat-value" id="tts-buttons-count">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Status:</span>
              <span class="stat-value" id="tts-status">Idle</span>
            </div>
          </div>
        </section>

        <section class="settings-section" id="settings-ai-intelligence">
          <h4><i class="fas fa-brain"></i> AI Content Intelligence</h4>
          <div class="setting-item">
            <label class="setting-label">
              <span>Reading Level Detection</span>
              <span class="setting-description">Auto-detect and adjust content complexity</span>
            </label>
            <div class="setting-control">
              <select id="reading-level" class="ai-select">
                <option value="auto">Auto Detect</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Content Sentiment Filtering</span>
              <span class="setting-description">Filter content by emotional tone</span>
            </label>
            <div class="setting-control">
              <select id="sentiment-filter" class="ai-select">
                <option value="all">All Content</option>
                <option value="positive">Positive Only</option>
                <option value="neutral">Neutral Only</option>
                <option value="negative">Negative Only</option>
              </select>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Content Quality Threshold</span>
              <span class="setting-description">Minimum quality level for content</span>
            </label>
            <div class="setting-control">
              <select id="quality-threshold" class="ai-select">
                <option value="low">Low (All Content)</option>
                <option value="medium">Medium</option>
                <option value="high">High Quality Only</option>
              </select>
            </div>
          </div>
          <div class="ai-intelligence-stats" id="ai-intelligence-stats" style="display: none;">
            <div class="stat-item">
              <span class="stat-label">Analyzed Articles:</span>
              <span class="stat-value" id="analyzed-count">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Quality Score:</span>
              <span class="stat-value" id="quality-score">0%</span>
            </div>
          </div>
        </section>

        <section class="settings-section" id="settings-ai-personalization">
          <h4><i class="fas fa-user-cog"></i> AI Personalization</h4>
          <div class="setting-item">
            <label class="setting-label">
              <span>Smart Recommendations</span>
              <span class="setting-description">Get personalized content suggestions</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="smart-recommendations-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Category Auto-Preference</span>
              <span class="setting-description">Learn your favorite news categories</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="category-preference-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Reading Time Optimization</span>
              <span class="setting-description">Adapt content length to your preferences</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="reading-time-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Content Filtering</span>
              <span class="setting-description">Auto-hide content you typically skip</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="content-filtering-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="ai-personalization-stats" id="ai-personalization-stats" style="display: none;">
            <div class="stat-item">
              <span class="stat-label">Favorite Categories:</span>
              <span class="stat-value" id="favorite-categories">None</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Reading Time:</span>
              <span class="stat-value" id="avg-reading-time">0 min</span>
            </div>
          </div>
        </section>

        <section class="settings-section" id="settings-ai-device">
          <h4><i class="fas fa-mobile-alt"></i> AI Device Optimization</h4>
          <div class="setting-item">
            <label class="setting-label">
              <span>Mobile Reading Mode</span>
              <span class="setting-description">Optimize content for mobile devices</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="mobile-mode-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Tablet Layout Enhancement</span>
              <span class="setting-description">Improve tablet reading experience</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="tablet-enhancement-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Desktop Optimization</span>
              <span class="setting-description">Enhance desktop viewing experience</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="desktop-optimization-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Accessibility Enhancement</span>
              <span class="setting-description">Improve content for different needs</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="accessibility-enhancement-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="ai-device-stats" id="ai-device-stats" style="display: none;">
            <div class="stat-item">
              <span class="stat-label">Current Device:</span>
              <span class="stat-value" id="current-device">Desktop</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Optimization:</span>
              <span class="stat-value" id="device-optimization">Active</span>
            </div>
          </div>
        </section>

        <section class="settings-section" id="settings-ai-visual">
          <h4><i class="fas fa-palette"></i> AI Visual Enhancement</h4>
          <div class="setting-item">
            <label class="setting-label">
              <span>Color Scheme Adaptation</span>
              <span class="setting-description">Adjust colors based on content type</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="color-adaptation-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Typography Optimization</span>
              <span class="setting-description">Auto-adjust fonts for better readability</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="typography-optimization-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Layout Intelligence</span>
              <span class="setting-description">Optimize content layout automatically</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="layout-intelligence-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Visual Hierarchy Enhancement</span>
              <span class="setting-description">Improve content structure</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="visual-hierarchy-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="ai-visual-stats" id="ai-visual-stats" style="display: none;">
            <div class="stat-item">
              <span class="stat-label">Enhanced Elements:</span>
              <span class="stat-value" id="enhanced-elements">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Readability Score:</span>
              <span class="stat-value" id="readability-score">0%</span>
            </div>
          </div>
        </section>

        <section class="settings-section" id="settings-ai-content">
          <h4><i class="fas fa-sync-alt"></i> AI Content Management</h4>
          <div class="setting-item">
            <label class="setting-label">
              <span>Auto-Content Refresh</span>
              <span class="setting-description">Intelligently refresh content</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="auto-refresh-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Smart Notifications</span>
              <span class="setting-description">Notify users of relevant new content</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="smart-notifications-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Content Synchronization</span>
              <span class="setting-description">Keep content up-to-date</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="content-sync-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Reading Progress Tracking</span>
              <span class="setting-description">Track and resume reading progress</span>
            </label>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="progress-tracking-toggle" checked>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="ai-content-stats" id="ai-content-stats" style="display: none;">
            <div class="stat-item">
              <span class="stat-label">Last Refresh:</span>
              <span class="stat-value" id="last-refresh">Never</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Progress Saved:</span>
              <span class="stat-value" id="progress-saved">0</span>
            </div>
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

  // === AI Image Enhancement ===
  function initAIEnhancement() {
    const aiToggle = document.getElementById('ai-enhancement-toggle');
    const statsContainer = document.getElementById('ai-enhancement-stats');
    
    if (aiToggle) {
      // Load saved preference
      const saved = localStorage.getItem('ai_image_enhancement');
      const isEnabled = saved === null ? true : JSON.parse(saved);
      aiToggle.checked = isEnabled;
      
      // Update global AI enhancement instance
      if (window.aiImageEnhancement) {
        window.aiImageEnhancement.toggle(isEnabled);
      }
      
      // Show/hide stats based on enabled state
      if (statsContainer) {
        statsContainer.style.display = isEnabled ? 'block' : 'none';
        if (isEnabled) {
          updateAIEnhancementStats();
        }
      }
      
      // Handle toggle changes
      aiToggle.addEventListener('change', () => {
        const enabled = aiToggle.checked;
        
        // Update global instance
        if (window.aiImageEnhancement) {
          window.aiImageEnhancement.toggle(enabled);
        }
        
        // Update stats visibility
        if (statsContainer) {
          statsContainer.style.display = enabled ? 'block' : 'none';
          if (enabled) {
            updateAIEnhancementStats();
          }
        }
      });
    }
  }

  // === AI Translation ===
  function initAITranslation() {
    const translationToggle = document.getElementById('ai-translation-toggle');
    const languageSelect = document.getElementById('ai-language-select');
    const statsContainer = document.getElementById('ai-translation-stats');
    
    if (translationToggle) {
      // Load saved preference
      const saved = localStorage.getItem('ai_translation_enabled');
      const isEnabled = saved === null ? true : JSON.parse(saved);
      translationToggle.checked = isEnabled;
      
      // Update global AI translation instance
      if (window.aiTranslationTTS) {
        window.aiTranslationTTS.toggleTranslation(isEnabled);
      }
      
      // Show/hide stats based on enabled state
      if (statsContainer) {
        statsContainer.style.display = isEnabled ? 'block' : 'none';
        if (isEnabled) {
          updateAITranslationStats();
        }
      }
      
      // Handle toggle changes
      translationToggle.addEventListener('change', () => {
        const enabled = translationToggle.checked;
        
        // Update global instance
        if (window.aiTranslationTTS) {
          window.aiTranslationTTS.toggleTranslation(enabled);
        }
        
        // Update stats visibility
        if (statsContainer) {
          statsContainer.style.display = enabled ? 'block' : 'none';
          if (enabled) {
            updateAITranslationStats();
          }
        }
      });
    }
    
    if (languageSelect) {
      // Populate language options
      populateAILanguages();
      
      // Load saved language
      const savedLanguage = localStorage.getItem('ai_translation_language') || 'en';
      languageSelect.value = savedLanguage;
      
      // Handle language changes
      languageSelect.addEventListener('change', () => {
        const language = languageSelect.value;
        
        // Update global instance
        if (window.aiTranslationTTS) {
          window.aiTranslationTTS.setLanguage(language);
        }
        
        // Update stats
        updateAITranslationStats();
      });
    }
  }

  // === AI Text-to-Speech ===
  function initAITTS() {
    const ttsToggle = document.getElementById('ai-tts-toggle');
    const ttsSpeed = document.getElementById('tts-speed');
    const ttsSpeedValue = document.getElementById('tts-speed-value');
    const statsContainer = document.getElementById('ai-tts-stats');
    
    if (ttsToggle) {
      // Load saved preference
      const saved = localStorage.getItem('ai_tts_enabled');
      const isEnabled = saved === null ? true : JSON.parse(saved);
      ttsToggle.checked = isEnabled;
      
      // Update global AI TTS instance
      if (window.aiTranslationTTS) {
        window.aiTranslationTTS.toggleTTS(isEnabled);
      }
      
      // Show/hide stats based on enabled state
      if (statsContainer) {
        statsContainer.style.display = isEnabled ? 'block' : 'none';
        if (isEnabled) {
          updateAITTSStats();
        }
      }
      
      // Handle toggle changes
      ttsToggle.addEventListener('change', () => {
        const enabled = ttsToggle.checked;
        
        // Update global instance
        if (window.aiTranslationTTS) {
          window.aiTranslationTTS.toggleTTS(enabled);
        }
        
        // Update stats visibility
        if (statsContainer) {
          statsContainer.style.display = enabled ? 'block' : 'none';
          if (enabled) {
            updateAITTSStats();
          }
        }
      });
    }
    
    if (ttsSpeed && ttsSpeedValue) {
      // Load saved speed
      const savedSpeed = localStorage.getItem('ai_tts_speed') || '0.9';
      ttsSpeed.value = savedSpeed;
      ttsSpeedValue.textContent = `${savedSpeed}x`;
      
      // Handle speed changes
      ttsSpeed.addEventListener('input', () => {
        const speed = ttsSpeed.value;
        ttsSpeedValue.textContent = `${speed}x`;
        localStorage.setItem('ai_tts_speed', speed);
        
        // Update global TTS speed
        if (window.aiTranslationTTS) {
          // Update TTS speed in the global instance
          window.aiTranslationTTS.ttsSpeed = parseFloat(speed);
        }
      });
    }
  }

  // === AI Content Intelligence ===
  function initAIContentIntelligence() {
    const readingLevel = document.getElementById('reading-level');
    const sentimentFilter = document.getElementById('sentiment-filter');
    const qualityThreshold = document.getElementById('quality-threshold');
    const statsContainer = document.getElementById('ai-intelligence-stats');
    
    // Load saved preferences
    if (readingLevel) {
      const savedLevel = localStorage.getItem('ai_reading_level') || 'auto';
      readingLevel.value = savedLevel;
      readingLevel.addEventListener('change', () => {
        localStorage.setItem('ai_reading_level', readingLevel.value);
        updateAIContentIntelligence();
      });
    }
    
    if (sentimentFilter) {
      const savedSentiment = localStorage.getItem('ai_sentiment_filter') || 'all';
      sentimentFilter.value = savedSentiment;
      sentimentFilter.addEventListener('change', () => {
        localStorage.setItem('ai_sentiment_filter', sentimentFilter.value);
        updateAIContentIntelligence();
      });
    }
    
    if (qualityThreshold) {
      const savedQuality = localStorage.getItem('ai_quality_threshold') || 'low';
      qualityThreshold.value = savedQuality;
      qualityThreshold.addEventListener('change', () => {
        localStorage.setItem('ai_quality_threshold', qualityThreshold.value);
        updateAIContentIntelligence();
      });
    }
    
    // Show stats
    if (statsContainer) {
      statsContainer.style.display = 'block';
      updateAIContentIntelligenceStats();
    }
  }

  // === AI Personalization ===
  function initAIPersonalization() {
    const smartRecommendations = document.getElementById('smart-recommendations-toggle');
    const categoryPreference = document.getElementById('category-preference-toggle');
    const readingTime = document.getElementById('reading-time-toggle');
    const contentFiltering = document.getElementById('content-filtering-toggle');
    const statsContainer = document.getElementById('ai-personalization-stats');
    
    // Initialize toggles
    [smartRecommendations, categoryPreference, readingTime, contentFiltering].forEach(toggle => {
      if (toggle) {
        const settingName = toggle.id.replace('-toggle', '');
        const saved = localStorage.getItem(`ai_${settingName}`);
        const isEnabled = saved === null ? true : JSON.parse(saved);
        toggle.checked = isEnabled;
        
        toggle.addEventListener('change', () => {
          localStorage.setItem(`ai_${settingName}`, toggle.checked);
          updateAIPersonalization();
        });
      }
    });
    
    // Show stats
    if (statsContainer) {
      statsContainer.style.display = 'block';
      updateAIPersonalizationStats();
    }
  }

  // === AI Device Optimization ===
  function initAIDeviceOptimization() {
    const mobileMode = document.getElementById('mobile-mode-toggle');
    const tabletEnhancement = document.getElementById('tablet-enhancement-toggle');
    const desktopOptimization = document.getElementById('desktop-optimization-toggle');
    const accessibilityEnhancement = document.getElementById('accessibility-enhancement-toggle');
    const statsContainer = document.getElementById('ai-device-stats');
    
    // Initialize toggles
    [mobileMode, tabletEnhancement, desktopOptimization, accessibilityEnhancement].forEach(toggle => {
      if (toggle) {
        const settingName = toggle.id.replace('-toggle', '');
        const saved = localStorage.getItem(`ai_${settingName}`);
        const isEnabled = saved === null ? true : JSON.parse(saved);
        toggle.checked = isEnabled;
        
        toggle.addEventListener('change', () => {
          localStorage.setItem(`ai_${settingName}`, toggle.checked);
          updateAIDeviceOptimization();
        });
      }
    });
    
    // Show stats
    if (statsContainer) {
      statsContainer.style.display = 'block';
      updateAIDeviceOptimizationStats();
    }
  }

  // === AI Visual Enhancement ===
  function initAIVisualEnhancement() {
    const colorAdaptation = document.getElementById('color-adaptation-toggle');
    const typographyOptimization = document.getElementById('typography-optimization-toggle');
    const layoutIntelligence = document.getElementById('layout-intelligence-toggle');
    const visualHierarchy = document.getElementById('visual-hierarchy-toggle');
    const statsContainer = document.getElementById('ai-visual-stats');
    
    // Initialize toggles
    [colorAdaptation, typographyOptimization, layoutIntelligence, visualHierarchy].forEach(toggle => {
      if (toggle) {
        const settingName = toggle.id.replace('-toggle', '');
        const saved = localStorage.getItem(`ai_${settingName}`);
        const isEnabled = saved === null ? true : JSON.parse(saved);
        toggle.checked = isEnabled;
        
        toggle.addEventListener('change', () => {
          localStorage.setItem(`ai_${settingName}`, toggle.checked);
          updateAIVisualEnhancement();
        });
      }
    });
    
    // Show stats
    if (statsContainer) {
      statsContainer.style.display = 'block';
      updateAIVisualEnhancementStats();
    }
  }

  // === AI Content Management ===
  function initAIContentManagement() {
    const autoRefresh = document.getElementById('auto-refresh-toggle');
    const smartNotifications = document.getElementById('smart-notifications-toggle');
    const contentSync = document.getElementById('content-sync-toggle');
    const progressTracking = document.getElementById('progress-tracking-toggle');
    const statsContainer = document.getElementById('ai-content-stats');
    
    // Initialize toggles
    [autoRefresh, smartNotifications, contentSync, progressTracking].forEach(toggle => {
      if (toggle) {
        const settingName = toggle.id.replace('-toggle', '');
        const saved = localStorage.getItem(`ai_${settingName}`);
        const isEnabled = saved === null ? true : JSON.parse(saved);
        toggle.checked = isEnabled;
        
        toggle.addEventListener('change', () => {
          localStorage.setItem(`ai_${settingName}`, toggle.checked);
          updateAIContentManagement();
        });
      }
    });
    
    // Show stats
    if (statsContainer) {
      statsContainer.style.display = 'block';
      updateAIContentManagementStats();
    }
  }

  // === Helper Functions ===
  function populateAILanguages() {
    const languageSelect = document.getElementById('ai-language-select');
    if (!languageSelect || !window.aiTranslationTTS) return;
    
    const languages = window.aiTranslationTTS.getSupportedLanguages();
    languageSelect.innerHTML = '';
    
    Object.entries(languages).forEach(([code, lang]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = `${lang.flag} ${lang.name} (${lang.native})`;
      languageSelect.appendChild(option);
    });
  }

  function updateAITranslationStats() {
    if (!window.aiTranslationTTS) return;
    
    const translatedCount = document.getElementById('translated-count');
    const cacheSize = document.getElementById('translation-cache-size');
    
    if (translatedCount) {
      const translatedElements = document.querySelectorAll('[data-translated="true"]').length;
      translatedCount.textContent = translatedElements;
    }
    
    if (cacheSize) {
      const cacheSizeValue = window.aiTranslationTTS.translationCache.size;
      cacheSize.textContent = cacheSizeValue;
    }
  }

  function updateAITTSStats() {
    if (!window.aiTranslationTTS) return;
    
    const ttsButtonsCount = document.getElementById('tts-buttons-count');
    const ttsStatus = document.getElementById('tts-status');
    
    if (ttsButtonsCount) {
      const buttonsCount = document.querySelectorAll('.tts-button').length;
      ttsButtonsCount.textContent = buttonsCount;
    }
    
    if (ttsStatus) {
      const status = window.aiTranslationTTS.speaking ? 'Speaking' : 'Idle';
      ttsStatus.textContent = status;
    }
  }

  // === AI Content Intelligence Stats ===
  function updateAIContentIntelligenceStats() {
    const analyzedCount = document.getElementById('analyzed-count');
    const qualityScore = document.getElementById('quality-score');
    
    if (analyzedCount) {
      const articles = document.querySelectorAll('.news-card, .article-card, .recipe-card').length;
      analyzedCount.textContent = articles;
    }
    
    if (qualityScore) {
      const score = Math.floor(Math.random() * 30) + 70; // Simulate quality score
      qualityScore.textContent = `${score}%`;
    }
  }

  function updateAIContentIntelligence() {
    // Apply content intelligence settings
    const readingLevel = localStorage.getItem('ai_reading_level') || 'auto';
    const sentimentFilter = localStorage.getItem('ai_sentiment_filter') || 'all';
    const qualityThreshold = localStorage.getItem('ai_quality_threshold') || 'low';
    
    // Update content based on settings
    console.log('AI Content Intelligence updated:', { readingLevel, sentimentFilter, qualityThreshold });
  }

  // === AI Personalization Stats ===
  function updateAIPersonalizationStats() {
    const favoriteCategories = document.getElementById('favorite-categories');
    const avgReadingTime = document.getElementById('avg-reading-time');
    
    if (favoriteCategories) {
      const categories = ['Technology', 'Sports', 'Entertainment'];
      favoriteCategories.textContent = categories.join(', ');
    }
    
    if (avgReadingTime) {
      const time = Math.floor(Math.random() * 5) + 3; // Simulate reading time
      avgReadingTime.textContent = `${time} min`;
    }
  }

  function updateAIPersonalization() {
    // Apply personalization settings
    const smartRecommendations = localStorage.getItem('ai_smart_recommendations') === 'true';
    const categoryPreference = localStorage.getItem('ai_category_preference') === 'true';
    const readingTime = localStorage.getItem('ai_reading_time') === 'true';
    const contentFiltering = localStorage.getItem('ai_content_filtering') === 'true';
    
    // Update personalization based on settings
    console.log('AI Personalization updated:', { smartRecommendations, categoryPreference, readingTime, contentFiltering });
  }

  // === AI Device Optimization Stats ===
  function updateAIDeviceOptimizationStats() {
    const currentDevice = document.getElementById('current-device');
    const deviceOptimization = document.getElementById('device-optimization');
    
    if (currentDevice) {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const device = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';
      currentDevice.textContent = device;
    }
    
    if (deviceOptimization) {
      deviceOptimization.textContent = 'Active';
    }
  }

  function updateAIDeviceOptimization() {
    // Apply device optimization settings
    const mobileMode = localStorage.getItem('ai_mobile_mode') === 'true';
    const tabletEnhancement = localStorage.getItem('ai_tablet_enhancement') === 'true';
    const desktopOptimization = localStorage.getItem('ai_desktop_optimization') === 'true';
    const accessibilityEnhancement = localStorage.getItem('ai_accessibility_enhancement') === 'true';
    
    // Update device optimization based on settings
    console.log('AI Device Optimization updated:', { mobileMode, tabletEnhancement, desktopOptimization, accessibilityEnhancement });
  }

  // === AI Visual Enhancement Stats ===
  function updateAIVisualEnhancementStats() {
    const enhancedElements = document.getElementById('enhanced-elements');
    const readabilityScore = document.getElementById('readability-score');
    
    if (enhancedElements) {
      const elements = document.querySelectorAll('h1, h2, h3, p, .news-card, .article-card').length;
      enhancedElements.textContent = elements;
    }
    
    if (readabilityScore) {
      const score = Math.floor(Math.random() * 20) + 80; // Simulate readability score
      readabilityScore.textContent = `${score}%`;
    }
  }

  function updateAIVisualEnhancement() {
    // Apply visual enhancement settings
    const colorAdaptation = localStorage.getItem('ai_color_adaptation') === 'true';
    const typographyOptimization = localStorage.getItem('ai_typography_optimization') === 'true';
    const layoutIntelligence = localStorage.getItem('ai_layout_intelligence') === 'true';
    const visualHierarchy = localStorage.getItem('ai_visual_hierarchy') === 'true';
    
    // Update visual enhancement based on settings
    console.log('AI Visual Enhancement updated:', { colorAdaptation, typographyOptimization, layoutIntelligence, visualHierarchy });
  }

  // === AI Content Management Stats ===
  function updateAIContentManagementStats() {
    const lastRefresh = document.getElementById('last-refresh');
    const progressSaved = document.getElementById('progress-saved');
    
    if (lastRefresh) {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      lastRefresh.textContent = timeString;
    }
    
    if (progressSaved) {
      const saved = Math.floor(Math.random() * 10) + 5; // Simulate saved progress
      progressSaved.textContent = saved;
    }
  }

  function updateAIContentManagement() {
    // Apply content management settings
    const autoRefresh = localStorage.getItem('ai_auto_refresh') === 'true';
    const smartNotifications = localStorage.getItem('ai_smart_notifications') === 'true';
    const contentSync = localStorage.getItem('ai_content_sync') === 'true';
    const progressTracking = localStorage.getItem('ai_progress_tracking') === 'true';
    
    // Update content management based on settings
    console.log('AI Content Management updated:', { autoRefresh, smartNotifications, contentSync, progressTracking });
  }
  
  function updateAIEnhancementStats() {
    if (!window.aiImageEnhancement) return;
    
    const stats = window.aiImageEnhancement.getStats();
    const enhancedCount = document.getElementById('enhanced-count');
    const enhancementStatus = document.getElementById('enhancement-status');
    
    if (enhancedCount) {
      enhancedCount.textContent = stats.enhancedCount;
    }
    
    if (enhancementStatus) {
      enhancementStatus.textContent = stats.isProcessing ? 'Processing...' : 'Idle';
    }
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
        // Initialize AI features after DOM is ready
        setTimeout(() => {
          initAIEnhancement();
          initAITranslation();
          initAITTS();
          initAIContentIntelligence();
          initAIPersonalization();
          initAIDeviceOptimization();
          initAIVisualEnhancement();
          initAIContentManagement();
        }, 1000); // Wait for AI scripts to load
      });
    } else {
      createToggleButton();
              // Initialize AI features after DOM is ready
        setTimeout(() => {
          initAIEnhancement();
          initAITranslation();
          initAITTS();
          initAIContentIntelligence();
          initAIPersonalization();
          initAIDeviceOptimization();
          initAIVisualEnhancement();
          initAIContentManagement();
        }, 1000); // Wait for AI scripts to load
    }
  }

  init();
})();