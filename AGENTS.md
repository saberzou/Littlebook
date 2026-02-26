# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Littlebook is a pure vanilla HTML/CSS/JS static website — no build tools, no package manager, no framework. All book/quote data is hardcoded in `data.js`. External APIs (Unsplash for wallpapers, Open Library for covers) are called client-side with graceful fallbacks.

### Running the dev server

```bash
serve -l 3000 .
```

Or alternatively: `python3 -m http.server 3000`

Then open `http://localhost:3000` in a browser.

### Lint / validation

- **JS syntax check:** `node --check app.js && node --check data.js`
- **HTML validation:** `npx html-validate index.html weekly.html` (some warnings are expected — empty `src` attributes are filled at runtime by JS, buttons without explicit `type` are intentional)

### Key files

| File | Purpose |
|------|---------|
| `index.html` | Main SPA — daily book/quote/wallpaper with swipeable pages |
| `weekly.html` | Weekly list view of all available books |
| `app.js` | Application logic (calendar, swipe, navigation, theme toggle) |
| `data.js` | Hardcoded daily data array + Unsplash/OpenLibrary API helpers |
| `style.css` | All styles (light/dark themes, 3D book, responsive) |

### Non-obvious notes

- Today's date (`2026-02-26`) has data in `data.js`, so the app will display content for today. The data covers dates from `2026-02-05` to `2026-02-27`.
- The calendar strip shows 7 days (5 past + today + tomorrow). Tomorrow shows an hourglass countdown.
- The Unsplash API key is hardcoded in `data.js`. If the API is rate-limited or unreachable, the wallpaper falls back to a placeholder URL.
- No automated test suite exists — validation is manual (browser) + JS syntax checking.
