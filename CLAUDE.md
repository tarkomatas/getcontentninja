# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static marketing landing site for **Content Ninja** (AI content-generation tool for webshops), served in Hungarian. Deployed via **GitHub Pages** from the repo root; `CNAME` sets the custom domain `contentninja.hu`. There is no build step, no framework, and no package manager — every page is a self-contained HTML file that loads Tailwind and fonts from CDNs at runtime.

The product app itself lives elsewhere (`https://app.contentninja.hu`); this repo is only the public landing/marketing surface.

## Development & deploy

- **Preview:** open the `.html` files directly, or serve the root over HTTP (e.g. `python -m http.server`) so relative asset paths and `fetch` behave. No install/build/lint/test tooling exists.
- **Deploy:** push to `main` — GitHub Pages publishes the root automatically. Do not add a bundler or move files into a `src/`/`dist/` layout without updating the Pages config.
- When adding a new public page, also add it to `sitemap.xml` (and `robots.txt` if it should be hidden from indexing, as `bemutato_koszi.html` is).

## Page map

- `index.html` — main landing (hero, features `#funkciok`, how-it-works `#hogyan-mukodik`, testimonials `#velemenyek`, pricing `#arazas`). Other pages deep-link back to these anchors.
- `bemutato.html` — conversion-focused demo/lead-capture page with a **multi-step qualifying form** (`#leadForm`). Navigation chrome is intentionally stripped here to keep focus on the form.
- `bemutato_koszi.html` — post-submit thank-you page. Fires the Facebook `Lead` pixel event, but **only when reached with `?lead=1`** in the URL.
- `adatkezeles.html`, `aszf.html`, `impresszum.html` — legal pages (privacy, ToS, imprint).

## Cross-cutting conventions

These patterns are duplicated by hand across every page (no shared includes) — when you change one, replicate it everywhere relevant:

- **Tailwind config is inline.** Each page defines the same `tailwind.config` block (`<script id="tailwind-config">`) with the brand theme: `primary #6c5ce7`, `dark #1e1e2f`, `body #4a4a68`, plus custom `boxShadow` tokens (`card`, `card-hover`, `primary-glow`) and Inter as the display/body font. Keep these tokens in sync across pages. Reusable button classes `.cta-primary` / `.cta-secondary` are defined in each page's `<style>`.
- **Analytics tags are in `<head>` of every page:** Google Ads gtag (`AW-10918594401`) loads eagerly; the Meta Pixel (`3857575907663677`) is **consent-gated** and injected by `assets/cookie.js` only after the user accepts the cookie banner. Any new page must include `<script src="assets/cookie.js"></script>` for the banner + consent logic to work.
- **Consent** is stored in `localStorage` under `contentninja_cookie_consent_v1` (`"true"`/`"false"`). The pixel never loads without it.

## Lead form flow (`bemutato.html`)

1. Multi-step form with qualifying questions; some answer paths route to `rejected` / `soft-reject` steps instead of submission.
2. On submit, the cleaned answers are POSTed as JSON to the **Make.com webhook** `https://hook.eu1.make.com/ihohtlulor66lvhouyoty9azbut7lzx7` (this URL is the integration point — changing the automation means changing this endpoint).
3. Duplicate submissions are blocked via `localStorage` key `ai_tartalomgyartas_form_submitted`.
4. **Regardless of webhook success/failure**, the user is redirected to `bemutato_koszi.html?lead=1` so the `Lead` conversion still fires and re-submission is prevented.
