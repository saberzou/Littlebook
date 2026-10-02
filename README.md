# Littlebook Archive

A permanent archive of 171 daily book recommendations and quotes, February 5–July 25, 2026.

- `index.html`: month calendar, latest saved entry by default, book opening interaction, previous/next entries.
- `index.html?date=2026-02-05`: permanent links to individual days.
- `weekly.html`: all entries, retained at its original URL.
- `data.js`: original content, preserved unchanged. Covers and existing audio use external services; book text and quotes remain available if those services fail.

No build step or daily updates are needed. Serve with `python3 -m http.server 3000`. The existing Vercel GitHub integration deploys `main`.

Validation: `node --check app.js` and `node --check data.js`, then check calendar navigation, date links, browser back/forward, book opening and mobile layout.
