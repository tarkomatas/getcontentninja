# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Bilingual (Hungarian + English) marketing landing site for **Content Ninja** (AI content-generation tool for webshops). Built with **Astro** (static output, no server) and deployed to **GitHub Pages** via GitHub Actions. `public/CNAME` sets the custom domain `getcontentninja.com` (the previous `contentninja.hu` domain 301-redirects to it externally).

The product app itself lives elsewhere (`https://app.getcontentninja.com`); this repo is only the public landing/marketing surface.

## Development & deploy

- **Install:** `npm install` (Node 18+). **Preview:** `npm run dev`. **Build:** `npm run build` → `dist/`. **Preview build:** `npm run preview`.
- **Deploy:** push to `main` — `.github/workflows/deploy.yml` runs `astro build` and publishes `dist/` to GitHub Pages. The Pages source must be set to **"GitHub Actions"** in the repo settings (not a branch).
- Do NOT open the `.astro` files as static HTML — they require the build. The old hand-written `.html` files were replaced by the Astro pages under `src/pages/`.

## i18n architecture

- **Two locales, both prefixed:** every page lives under `/hu/…` or `/en/…`. Configured in `astro.config.mjs` (`i18n` with `prefixDefaultLocale: true`). The site root `/` (`src/pages/index.astro`) is a JS language-detecting redirect to `/hu/` or `/en/` (default `/hu/`, `noindex`).
- **Translated slugs**, mapped in `src/i18n/routes.ts` — the single source of truth for URLs, hreflang alternates (`alternatesFor`), and the language switcher target (`switchTarget`). Change URLs here, not by renaming files ad-hoc.
  - `home` → `/hu/` , `/en/`
  - `demo` → `/hu/posztolas` , `/en/demo` (the **"Automata posztolás" solution** page, reached from the Solutions dropdown/cards; the old `/hu/bemutato` redirects here via `astro.config.mjs` `redirects`)
  - `bookDemo` → `/hu/online-bemutato` , `/en/book-demo` (the general **"Bemutatót kérek" / "Book a demo"** landing — hero + lead form covering posting **and** newsletter; every header/footer/homepage demo CTA points here, `lead_forras: 'online-bemutato'`)
  - `newsletter` → `/hu/hirlevel` , `/en/newsletter` (AI hírlevél kampányoldal — same lead-form flow, `lead_forras: 'hirlevel'`)
  - `thanks` → `/hu/koszonjuk` , `/en/thank-you`
  - `privacy` → `/hu/adatkezeles` , `/en/privacy-policy` (the full policy text is **English only** for Meta App Review; the HU page is a short referral to it)
  - `terms` → `/en/terms` (**English only** — the old `/hu/aszf` redirects here via `astro.config.mjs` `redirects`; all footers link to the EN page)
  - `imprint` → `/hu/impresszum` , `/en/imprint`
  - `dataDeletion` → `/en/data-deletion` (**English only** — Meta-required data deletion instructions)
- **Section anchor ids are identical across locales** (`#funkciok`, `#hogyan-mukodik`, `#arazas`, `#velemenyek`) so the shared nav works in both languages. Do not translate these ids.
- **Chrome strings** (nav, footer, cookie banner, language switcher) live in `src/i18n/ui.ts` keyed by locale. **Page prose** lives directly in each locale's page file (not in a dictionary) — translate by editing the `/en/` page against its `/hu/` counterpart.

## Project layout

- `src/layouts/BaseLayout.astro` — the `<head>` for every page: analytics, inline `tailwind.config`, fonts, canonical + hreflang (computed from `page`+`locale` props), OG tags, and the consent-gated `cookie.js` at end of `<body>`. Props: `locale`, `page`, `title`, `description`, optional `keywords`/`og*`/`canonical`/`noindex`/`bodyClass`.
- `src/components/` — `Header.astro`, `Footer.astro` (shared chrome, auto-localized via `ui.ts`), `LanguageSwitcher.astro`.
- `src/pages/hu/*.astro`, `src/pages/en/*.astro` — one file per page per locale. Campaign/solution pages use the shared `Header` (full nav; `?type=ld` switches it to minimal — see landing mode below) but keep minimal inline footers. Only the thank-you pages (`koszonjuk`/`thank-you`) omit the shared `Header` entirely to keep conversion focus.
- `src/styles/global.css` — the shared design system (`.cta-*` buttons, nav, hero gradient, FAQ accordion, animations). Imported once by `BaseLayout`.
- `public/` — static assets (`assets/`), `CNAME`, `robots.txt`, `sitemap.xml`, and **legacy redirect stubs** (`bemutato.html`, `adatkezeles.html`, …) that meta-refresh old indexed URLs to the new `/hu/…` paths.

## Image generation

- Site images can be generated with `scripts/gen-image.mjs` (Google Gemini "Nano Banana" image API) → `public/assets/`. Run via `npm run gen:image -- -p "PROMPT" -o public/assets/NAME.webp -a 16:9`. Needs `GEMINI_API_KEY` in `.env` (gitignored, never deployed); default model `gemini-3-pro-image-preview`.
- `.webp` output is auto-converted from the API's JPEG via `sharp` (a devDependency) — prefer `.webp` for site images (≈20× smaller than JPEG).
- The **`generate-image` skill** (`.claude/skills/generate-image/`) documents the full workflow and prompt best practices (brand palette, style consistency with existing assets, no rendered text in images, aspect ratios). Invoke it whenever creating/replacing/editing a site image. After generating, always wire the `<img>` into the page with locale-appropriate `alt` text.

## Cross-cutting conventions

- **Design tokens & style conventions** are documented in [`DESIGN.md`](DESIGN.md) (canonical section rhythm, eyebrow/heading/card/button/color tokens; homepage is the etalon). Keep new/edited pages on those tokens.
- **Copywriting rules** live in the **`page-copy` skill** (`.claude/skills/page-copy/`) — hero formula (H1 = kategória + célcsoport + funkció, `text-primary` highlights, slogan → subhead), 5-second clarity test. Invoke it whenever planning, writing, or reviewing page copy or a hero section.
- **Tailwind is CDN + inline config** (in `BaseLayout`, `is:inline` so Astro leaves it untouched): `primary #6c5ce7`, `dark #1e1e2f`, `body #4a4a68`, custom `boxShadow` tokens (`card`, `card-hover`, `primary-glow`), Inter font. There is no Tailwind build step.
- **Any inline `<script>` that must stay classic/global** (references from `onclick`, immediate IIFEs, `tailwind.config`, gtag, JSON-LD) is marked **`is:inline`** — otherwise Astro bundles it as a scoped module and `onclick`-referenced globals (e.g. `toggleFaq`) break.
- **Videós bemutatók:** YouTube-beágyazás a `VideoEmbed.astro` komponenssel — click-to-load facade, az iframe csak kattintásra töltődik be `youtube-nocookie.com`-ról, addig csak a cookie-mentes ytimg borítókép látszik (így a consent-banner előtt sem kerül YouTube-süti a látogatóhoz). A videó-azonosítók **egy helyen**, a `src/data/videos.ts`-ben vannak. A meglévő két bemutató magyar nyelvű, ezért **csak a `/hu/` oldalakon** (főoldal, hírlevél) szerepel — az `/en/` párjaikba szándékosan nem került be. A `public/assets/*.mp4` fájlok ettől függetlenül a *termék által generált* minta-videók (posztolás oldalak), nem walkthrough-k.
- **Analytics:** Google Ads gtag (`AW-10918594401`) loads eagerly in `BaseLayout`. The Meta Pixel (`3857575907663677`) is **consent-gated** and injected by `public/assets/cookie.js` only after the user accepts the banner. `cookie.js` localizes its own text from `document.documentElement.lang`.
- **Consent** is stored in `localStorage` under `contentninja_cookie_consent_v1` (`"true"`/`"false"`). The pixel never loads without it.
- **Landing ("lp") mode for ads:** marketing pages pass `lpEnabled` to `BaseLayout`, which emits an early-`<head>` `is:inline` script — on `?type=ld` (or `?lp=1`) it adds `lp-mode` to `<html>` before first paint. In lp mode the shared `Header` collapses to **logo + language switcher** via the `global.css` markers `.lp-hide` (nav, login, demo CTA, hamburger) and `.lp-show` (language switcher, forced visible on mobile too). Nothing is persisted — param-less internal navigation always shows the full header. Legal/technical pages (privacy, terms, imprint, data-deletion, thank-you) intentionally do **not** set `lpEnabled`. Ad final URLs should append `?type=ld`.
- **sitemap.xml is hand-maintained** in `public/` (with `xhtml:link` hreflang alternates). The `@astrojs/sitemap` integration was removed due to an Astro-4/sitemap-3.7 hook incompatibility. When adding/renaming a page, update `routes.ts`, `sitemap.xml`, and `robots.txt` (thank-you pages are `Disallow`ed).

## Lead form flow (`posztolas.astro` / `demo.astro`)

1. Multi-step qualifying form (`#leadForm`); some answer paths route to `rejected` / `soft-reject` steps instead of submission.
2. On submit, cleaned answers are POSTed as JSON to the **Make.com webhook** `https://hook.eu1.make.com/ihohtlulor66lvhouyoty9azbut7lzx7` (the integration point — same endpoint for both locales; do not translate the JSON field names).
3. Duplicate submissions are blocked via `localStorage` key `ai_tartalomgyartas_form_submitted`.
4. **Regardless of webhook success/failure**, the user is redirected to the localized thank-you page with `?lead=1` (`/hu/koszonjuk?lead=1` or `/en/thank-you?lead=1`) so the `Lead` conversion still fires and re-submission is prevented.
