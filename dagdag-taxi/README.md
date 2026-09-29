# DagDag Taxi — website

Static site for DagDag Taxi, Culemborg. Plain HTML/CSS/JS, no build step.

```
python3 -m http.server 8000   # then open http://localhost:8000
```

Deploy by uploading this folder to any static host (Netlify, Vercel, GitHub Pages, a regular web host).

## Before going live

- **Phone / WhatsApp:** set the real numbers in `CONFIG` at the top of `main.js`,
  and replace `+31600000000` / `06 00 00 00 00` in `index.html` (they are the no-JS fallback).
- **Travel times:** the destination board reads from `ROUTES` in `main.js`. Names ≤ 12 characters.
- **Photos** in `assets/` were generated with Higgsfield as stand-ins. Swap in real photos of
  your car and Culemborg when you have them (same file names, `.webp`).

## Motion

- Logo is split into layers (`assets/logo-*.png`) so the hand waves: on load, on hover,
  and every time the footer logo scrolls into view.
- Split-flap departure board, scroll-drawn route line, parallax photo band, scroll reveals.
- Everything is switched off for visitors with "reduce motion" enabled.
