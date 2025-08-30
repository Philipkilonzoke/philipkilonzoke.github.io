# Brightlens News.

A fast, modern, mobile‑first news and media hub focused on Kenya and global coverage. It aggregates real‑time articles from multiple sources, includes category‑specific experiences (Live TV, Aviation, Weather, Food & Recipes), supports 12+ themes, and ships as a PWA..

## Live site

- GitHub Pages: https://philipkilonzoke.github.io/

## Key features

- News aggregation with duplicate removal, relevance filters, and newest‑first sorting
- Categories: Latest, Kenya, World, Entertainment, Technology, Business, Sports, Health, Lifestyle, Food, Crypto, Astronomy, Aviation, Weather, Live TV
- 12+ color themes with instant theme modal (`css/themes.css`, `js/themes.js`)
- PWA: offline caching, install experience (`manifest.json`, `service-worker.js`)
- OneSignal push notifications (`js/push-notifications.js`)
- Accessibility: keyboard navigation, focus states, aria‑labels, and ESC to close overlays
- Performance: lazy loading, preconnects, intersection observers, and careful caching

## Repository structure

```
/                      # Static site root (GitHub Pages)
├─ index.html          # Homepage
├─ latest.html         # Breaking news
├─ kenya.html          # Kenya category (enhanced relevance and freshness)
├─ world.html
├─ entertainment.html
├─ technology.html
├─ business.html
├─ sports.html
├─ health.html
├─ lifestyle.html
├─ food.html           # Food & Recipes
├─ crypto.html
├─ astronomy.html
├─ aviation.html       # Aviation hub + live flight tracker
├─ weather.html        # Weather experience
├─ live-tv.html        # Live TV hub (sticky inline player)
├─ manifest.json       # PWA manifest
├─ service-worker.js   # Caching (Pages + optional offline)
├─ js/
│  ├─ main.js                  # Homepage logic
│  ├─ news-api.js              # Aggregation + adapters + enhanced categories
│  ├─ category-news.js         # Shared category renderer
│  ├─ live-tv.js               # Live TV logic (grid, sticky player, filters)
│  ├─ sidebar-navigation.js    # Sidebar & mobile toggle
│  ├─ settings.js, themes.js   # Theme modal + persistence
│  ├─ push-notifications.js    # OneSignal integration
│  └─ ... (weather.js, etc.)
├─ css/
│  ├─ styles.css               # Base styles + grid, header, cards
│  ├─ themes.css               # 12+ theme variables
│  ├─ live-tv.css              # Live TV specific styles
│  └─ weather.css              # Weather styles
└─ assets/
   ├─ js/live-channels.js      # Live TV channel data (30 channels)
   ├─ media/hero.mp4           # Hero video for Live TV (small loop)
   ├─ icon-192.svg, icon-512.svg
   └─ default.svg
```

## Local development

This is a static site (no build step). Open any `.html` file directly or run a static server to test PWA features.

- Quick start:
  - Open `index.html` in your browser, or
  - `npx serve .` (or use any static server) and visit `http://localhost:3000` (port may vary)

- PWA/Service Worker:
  - Service worker requires HTTPS or `localhost`. For debugging, you can hard‑refresh or unregister the SW via DevTools (Application → Service workers → Unregister).
  - Live TV page intentionally does not re‑register the SW to avoid caching confusion during updates.

- API keys:
  - News APIs are configured in `js/news-api.js`. Keys are embedded for a demo experience; replace with your own API keys where needed.
  - OneSignal is initialized in `js/push-notifications.js` (update `appId` if you use a different project).

## Data sources (News)

Adapters in `js/news-api.js`:
- GNews
- NewsData.io
- NewsAPI.org
- Mediastack
- CurrentsAPI

Enhancements:
- Sports: specialized multi‑source strategy to increase volume and recency
- Kenya: enhanced Kenya‑relevant filters (keywords + domain heuristics), duplicates removed, newest‑first; page further filters to last 48 hours for freshness
- Technology/Health: boosted relevance and timeliness with dedicated adapters

## Category specifics

### Kenya
- Enhanced multi‑source fetching with expanded Kenya‑relevance detection (keywords + Kenyan domains + known sources)
- Deduped, newest‑first sorting; page filters to last 48h to keep content fresh

### Live TV (`live-tv.html`)
- 30 curated channels in `assets/js/live-channels.js` (YouTube + FAST: Pluto, Tubi, Plex, Red Bull, Fubo)
- Grid of channel cards with icons and Watch button
- Sticky inline player (top on desktop, bottom on mobile), ESC/× closes
- Filters (All/News/Sports/Entertainment/Science), search, and favorites (localStorage)
- Autoplay for YouTube; sandbox for FAST providers; graceful message if a provider blocks embeds
- Dark mode by default; fully themeable via the global theme system

To add or edit channels:
- Update `assets/js/live-channels.js` (id, name, icon, embed, category)

### Aviation (`aviation.html`)
- Live flight tracker using AviationStack + OpenSky (fastest source wins)
- Airline names inferred from flight numbers if missing; fewer “Unknown” labels
- Sorting (departure/arrival time, airline), UTC/Local time toggle, favorites (pin), copy info
- Auto refresh with countdown, search and status filter

### Weather
- Dedicated `weather.html` with a richer layout and styling

### Food & Recipes
- Pulls recipes with lazy image loading and resilient fallbacks

## Theming

- Themes are defined in `css/themes.css` and applied via `js/themes.js`
- Open the theme modal from the header palette icon
- Selected theme persists in localStorage and is applied across pages

## Accessibility

- Keyboard support for overlays (ESC to close), Enter/Space to activate, and consistent focus states
- Aria labels and live regions for player status updates

## Caching & service worker

- `service-worker.js` caches core pages and assets. Cache name bump forces eviction of stale content when updated.
- For debugging caching issues: hard refresh (Ctrl/Cmd+Shift+R) or temporarily unregister the service worker in DevTools.

## Deployment

- The repo is configured for GitHub Pages
- Commit to `main`; Pages will serve `main` branch content
- SW updates may require a hard refresh for clients

## Troubleshooting

- “Live TV shows old layout or empty grid” → Hard refresh and/or unregister SW. Ensure `assets/js/live-channels.js` is loading; the page retries once if not ready.
- “Kenya shows few items” → APIs may be rate‑limited. The page filters to last 48h by design; volume increases automatically as sources publish new items.
- “Aviation shows Unknown airline” → With OpenSky, some records lack names; we infer by IATA code when possible, otherwise show a neutral label.

## Contributing

- Fork and open a PR on `main`
- Keep pages static and CDN‑friendly (no build step)
- Match code style: clear names, early returns, minimal nesting, and accessible UIs

## Security

- Never commit private API keys to the repo. If you rotate keys, update `js/news-api.js` and re‑deploy.

## License

All rights reserved © 2025 Brightlens News

## AI Panel LLM Endpoint (optional)

To upgrade summaries with an LLM and improve reliability/speed:

- Cloudflare Workers:
  - Deploy `server/brightlens-llm-worker.js` as a Worker
  - Set secret env var `HF_TOKEN` (Hugging Face Inference API token)
  - Note the worker URL, e.g. `https://your-worker.your-domain.workers.dev`
- Configure the client:
  - Set `window.BL_LLM_ENDPOINT` at runtime (e.g., in `js/ai-config.js`) to the worker base URL (no trailing slash)

The AI panel will use the endpoint to upgrade highlights when available and fall back to local extractive summaries on timeout or error.
