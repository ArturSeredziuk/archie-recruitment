# Archie Recruitment

Outsourced recruitment for the Dutch market. Static landing page built with vanilla HTML, CSS, and a small amount of JavaScript — no build step.

## Live site

- Production: https://www.archie-recruitment.com
- Preview / staging: `*.pages.dev` (auto-deployed on every push to `main`)

## Local development

This is a single-file static site. Just open `index.html` in a browser, or serve it locally:

```bash
# Any static server works — pick one:
python -m http.server 8080         # http://localhost:8080
npx serve .                         # auto-port
# Or just double-click index.html
```

## Project structure

```
.
├── index.html          # The whole site (HTML + inline CSS + inline JS)
├── AR_black.svg        # Archie Recruitment logo, black
├── AR_white.svg        # Archie Recruitment logo, white (used in dark CTA section)
├── AR_black_tight.png  # Bbox-cropped PNG of AR (LinkedIn banner)
├── MR_logo_black.png   # MrRecruit.me logo, black, transparent bg (LinkedIn banner)
├── banner_C.png        # LinkedIn cover banner — Archie × MrRecruit collab
├── artur_photo.jpg     # Profile photo used in the LinkedIn card section
└── README.md
```

## Deployment

The site auto-deploys to **Cloudflare Pages** on every push to `main`. To deploy a change:

```bash
git add .
git commit -m "Describe change"
git push
```

Cloudflare Pages picks it up automatically (~30s build).

## Editing notes

- The site uses Google Fonts (Instrument Serif + Geist) — needs internet on first load, then cached.
- All CSS and JS is inline in `index.html` — single source of truth.
- The morphing CTA pill (hero → floating bottom) is scroll-linked via a persistent rAF loop. See the `<script>` near the bottom of `index.html`.
- The "Check the offer" drawer slides from the right on mobile, from the bottom (full-page) on desktop (`@media (min-width: 901px)`).
- LinkedIn banner is a separate composition stored as `banner_C.png` — used both on Artur's actual LinkedIn profile and inside the embedded card on the landing page.

## License

All rights reserved. Brand assets, copy, and design © Archie Recruitment.
