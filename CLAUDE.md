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
- **Every internal URL ends with a trailing slash** (`/hu/posztolas/`, not `/hu/posztolas`) — in `routes.ts`, in hardcoded `href`s, and in `public/sitemap.xml`. GitHub Pages serves the directory build only at the slashed URL and 301s the bare form to it, so declaring the bare form would point every canonical, hreflang entry and internal link at a redirect. `trailingSlash: 'always'` in `astro.config.mjs` keeps dev honest. Do **not** "fix" this by switching `build.format` to `'file'`: that serves the bare URLs with 200 but turns the slashed URLs — the ones Google has indexed — into 404s.
- **Translated slugs**, mapped in `src/i18n/routes.ts` — the single source of truth for URLs, hreflang alternates (`alternatesFor`), and the language switcher target (`switchTarget`). Change URLs here, not by renaming files ad-hoc. Paths below are written without the trailing slash for readability; the actual values in `routes.ts` all carry it.
  - `home` → `/hu/` , `/en/`
  - `demo` → `/hu/posztolas` , `/en/demo` (the **"Automata posztolás" solution** page, reached from the Solutions dropdown/cards; the old `/hu/bemutato` redirects here via `astro.config.mjs` `redirects`)
  - `bookDemo` → `/hu/online-bemutato` , `/en/book-demo` (the general **"Bemutatót kérek" / "Book a demo"** landing — hero + lead form covering posting **and** newsletter; every header/footer/homepage demo CTA points here, `lead_forras: 'online-bemutato'`)
  - `newsletter` → `/hu/hirlevel` , `/en/newsletter` (AI hírlevél kampányoldal — same lead-form flow, `lead_forras: 'hirlevel'`)
  - `newsletterSignup` → `/hu/hirlevel-feliratkozas` , **csak magyarul** (`en: null`) — **a MI hírlevelünk feliratkozó céloldala**, nem keverendő a fenti `newsletter`-rel (az a *termék* hírlevél-modulját adja el). A rövid `/hu/hirlevel/` slugot az foglalja. Indexelhető, teljes navigációval (nyilvános céloldal: ide linkelünk a levelekből, a supportból, a közösségi profilokból). **Nem a lead-űrlapok útján megy** — lásd a hírlevél-feliratkozás szakaszt lentebb. Azért csak magyarul, mert maga a hírlevél és az app megerősítő levele magyar; ha megjelenik angolul, egy `/en/newsletter-signup/` fájllal bővíthető (a `NewsletterForm` már tud angolul).
  - `allInOne` → `/hu/teljes-rendszer` , `/en/all-in-one` (**all-in-one kampányoldal, csak fizetett forgalomra**: `noindex` + `robots.txt` Disallow. Az AJÁNLAT azonos a `bookDemo`-éval — ugyanaz az űrlap, ugyanazok a kiszűrő kérdések, ugyanaz a köszönőoldal —, csak a HOROG más: nem a bemutató eseménye, hanem az „egy rendszer az egész webshop-marketingedre" ígéret. Külön `lead_forras: 'teljes-rendszer'` méri, melyik szög hoz több jelentkezést; **a kiszűrő kérdéseket ezért nem szabad eltéríteni a `bookDemo`-étól**. Egy pluszkérdése van, a `module_interest` (max. 3 pipa → rejtett mezőbe fűzve), amin nincs `data-reject`, tehát a minősítést nem befolyásolja)
  - `shopgradeAudit` → `/hu/termekleiras-diagnozis` , **csak magyarul** (`en: null`) — az **opt-in (squeeze) oldal**: a csali az app ingyenes, belépés nélküli termékleírás-diagnózisa. Három dologban tér el minden más kampányoldaltól: (1) **nincs navigáció** — nem a közös `Header`-t használja, hanem saját, linkmentes fejlécet (a köszönőoldalak mintájára), mert egy opt-in oldalon minden kifelé mutató link konverziót visz; (2) **a csali azonnal jár** — sikeres beküldés után nem a köszönőoldalra megy, hanem az app diagnózis-oldalára (lásd `successUrl` lentebb); (3) `noindex`, hogy ne versenyezzen a `/hu/shopgrade/` oldallal ugyanarra a kifejezésre — de **`robots.txt` Disallow NÉLKÜL** (2026-08-19): a tiltás megakadályozta, hogy a Google egyáltalán lássa a `noindex`-et, az AI-fetchereket (ChatGPT stb.) pedig elzárta az oldal szövegétől. Ne tedd vissza. Azért csak magyarul, mert az app diagnózisa egynyelvű — egy angol opt-in magyar eredményoldalra vinne.
  - `thanks` → `/hu/koszonjuk` , `/en/thank-you`
  - `privacy` → `/hu/adatkezeles` , `/en/privacy-policy`
  - `terms` → `/hu/aszf` , `/en/terms`
  - `imprint` → `/hu/impresszum` , `/en/imprint`
  - `dataDeletion` → `/hu/adattorles` , `/en/data-deletion` (Meta-required data deletion instructions)

  **A jogi oldalak 2026 augusztusa óta MINDKÉT nyelven teljes szöveggel élnek** (korábban a `terms`,
  a `dataDeletion` és a `privacy` teljes szövege csak angolul volt meg). A `/hu/aszf` → `/en/terms`
  átirányítás megszűnt az `astro.config.mjs`-ből — **ne tedd vissza**. A magyar szöveg az elsődleges
  és irányadó (nyelvi záradék minden jogi oldal fejlécében), az angol a Meta App Review és a
  külföldi ügyfelek miatt marad. A `Footer.astro` és a kampányoldalak inline láblécei mind az
  **azonos nyelvű** jogi oldalra mutatnak; a kereszthivatkozások (ÁSZF ↔ adatkezelési tájékoztató ↔
  adattörlés) is nyelven belül maradnak, `pathFor(..., locale)`-lel. Az átvezetés forrása a
  `C:\DEV\Content Ninja\docs\legal\jogi-doksi-frissites-brief.md` brief.
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
- **`define:vars` ráadásul IIFE-be csomagolja a scriptet**, ezért az `is:inline` önmagában NEM elég: a benne deklarált függvények nem lesznek globálisak, és az `onclick="valami()"` némán elszáll. Ilyenkor kézzel kell kitenni őket (`window.qualifyAndNext = qualifyAndNext;` — lásd `LeadFormScript.astro`).
- **Videós bemutatók:** YouTube-beágyazás a `VideoEmbed.astro` komponenssel — click-to-load facade, az iframe csak kattintásra töltődik be `youtube-nocookie.com`-ról, addig csak a cookie-mentes ytimg borítókép látszik (így a consent-banner előtt sem kerül YouTube-süti a látogatóhoz). A videó-azonosítók **egy helyen**, a `src/data/videos.ts`-ben vannak. A meglévő két bemutató magyar nyelvű, ezért **csak a `/hu/` oldalakon** (főoldal, hírlevél) szerepel — az `/en/` párjaikba szándékosan nem került be. A `public/assets/*.mp4` fájlok ettől függetlenül a *termék által generált* minta-videók (posztolás oldalak), nem walkthrough-k.
- **Modulrács ("mit tud a rendszer") – EGY forrás:** a modulok listája **kizárólag** a `src/data/modules.ts`-ben él (10 modul: posztolás, blogcikk író, Shopgrade, hírlevél, webshop-integráció, nemzetközi, kép, videó, narrátorvideó, Meta hirdetés), és a `src/components/ModuleGrid.astro` rakja ki. Minden kampányoldal a saját témáját hagyja ki (`exclude="newsletter"` stb.), így **9 kártya = tiszta 3×3 rács**; aminek van kampányoldala, arra "Részletek →" link kerül. **Új modulnál csak a `modules.ts`-t kell bővíteni** — korábban ez a blokk 12 oldalon kézzel volt másolva, ezért maradtak ki belőle az új modulok. Ugyanebből a fájlból épül a fejléc **"Megoldások" lenyílója** is (`navModulesFor`, `navLabel`/`navDesc` mezők; 6 elem → 2 hasábos, ~580px panel + "Összes megoldás →" sor a főoldal `#megoldasok` szekciójára), ezért a modulnevek NEM a `ui.ts`-ben élnek. Kivétel: az `online-bemutato`/`book-demo` "Mit mutatunk meg a bemutatón?" rácsa szándékosan kézi (nem modullista, a "Teljes automatizálás" kártya miatt). A `teljes-rendszer`/`all-in-one` oldalpár ezzel szemben `exclude` NÉLKÜL, `compact` proppal kéri a rácsot (4 hasáb, kisebb kártyák) — ott pont a teljesség a termék, és mind a 10 modul kikerül.
- **Lapozgatható kártyasáv:** `src/components/Carousel.astro` (natív scroll-snap + nyíl + pontok, külső könyvtár nélkül). A kártyák slotban jönnek, és **ők adják meg, hány látszik egyszerre** (a főoldali megoldás-kártyák `lg:basis-[calc((100%-4.5rem)/4)]` → desktopon 4). A nyíl egy kártyát lép, a pontok száma töréspontonként újraszámolódik (`kártyák - látható + 1`), a scrollbart a `global.css` `.no-scrollbar` rejti el. A főoldali "Megoldások" szekció ezt használja, hogy a 6 modul ne törje szét a rácsot.
- **Analytics:** **both** trackers are consent-gated — `public/assets/cookie.js` injects the Meta Pixel (`3857575907663677`) and the Google Ads gtag (`AW-10918594401`) only after the user accepts the banner (`loadTrackers()`). `BaseLayout` emits just the `gtag()` **queue stub** (`dataLayer.push`, no network, no cookies), so a conversion call placed on a page still works: it queues and replays once gtag.js loads. Never move the gtag.js `<script>` back into `BaseLayout` — that reintroduces ad cookies before consent. `cookie.js` localizes its own text from `document.documentElement.lang`.
- **Consent** is stored in `localStorage` under `contentninja_cookie_consent_v1` (`"true"`/`"false"`). The pixel never loads without it.
- **Landing ("lp") mode for ads:** marketing pages pass `lpEnabled` to `BaseLayout`, which emits an early-`<head>` `is:inline` script — on `?type=ld` (or `?lp=1`) it adds `lp-mode` to `<html>` before first paint. In lp mode the shared `Header` collapses to **logo + language switcher** via the `global.css` markers `.lp-hide` (nav, login, demo CTA, hamburger) and `.lp-show` (language switcher, forced visible on mobile too). Nothing is persisted — param-less internal navigation always shows the full header. Legal/technical pages (privacy, terms, imprint, data-deletion, thank-you) intentionally do **not** set `lpEnabled`. Ad final URLs should append `?type=ld`.
- **sitemap.xml is hand-maintained** in `public/` (with `xhtml:link` hreflang alternates). The `@astrojs/sitemap` integration was removed due to an Astro-4/sitemap-3.7 hook incompatibility. When adding/renaming a page, update `routes.ts`, `sitemap.xml`, and `robots.txt` (thank-you pages are `Disallow`ed).

## Űrlap-beküldés – EGY forrás (mind a 18 űrlap)

A honlap összes űrlapja **közvetlenül az appnak** küld: `POST https://app.getcontentninja.com/api/leads/intake`.
A korábbi Make.com webhook ki lett vezetve (a forgatókönyv leállítva, de visszakapcsolható). A fogadó
oldal szerződését az app repó `docs/honlap-urlap-kuldes-feladat.md`-je írja le, a honlap-oldali terv:
[`docs/urlap-kuldes-terv.md`](docs/urlap-kuldes-terv.md).

- **`src/data/forms.ts`** – az egyetlen igazságforrás: a végpont-URL, a `lead_forras` kulcsok, a belső
  levél tárgy-előtagjai és a storage-kulcsok. **A végpont sehol máshol nincs leírva.**
- **`src/components/IntakeClient.astro`** – a szállítás: `window.cnIntake.send(payload, { waitMs })`.
  A `BaseLayout` teszi ki **minden** oldalra, és ez nem elírás: a sikeres beküldés után azonnal
  átirányítunk, tehát a bent maradt beküldést a **köszönőoldal** `flush()`-a küldi el. Nem mérés és nem
  süti → hozzájárulás nélkül is működnie kell.
- **`src/components/LeadFormScript.astro`** – a többlépcsős lead-űrlap teljes logikája (korábban 14
  oldalfájlban másolva). Props: `locale`, `source`. Az oldal csak a markupot adja.
- **`src/components/HoneypotField.astro`** – a rejtett `website` mező (`.hp-field` a `global.css`-ben).
- **Opt-in oldalak: `successUrl` + `cnResolveSuccessUrl`.** A `LeadFormScript` opcionális `successUrl`
  propja felülírja a köszönőoldalra mutató átirányítást — ezt használja a `termekleiras-diagnozis`
  oldal, hogy a látogató egyből az app elemzésére kerüljön. ⚠️ **A Meta `Lead` eseményt ilyenkor a
  `LeadFormScript` maga lövi el** (`trackLeadHere`), közvetlenül a beküldés előtt, mert a köszönőoldal
  — ami egyébként a `?lead=1`-re tüzelne — kimarad az útból. Enélkül a konverzió némán elveszne.
- **Átadás az elemzésnek (`handoff`).** Az oldal definiálhat egy `window.cnResolveSuccessUrl(extra)`
  függvényt; a `LeadFormScript` megvárja (max. 2,5 mp), és a visszaadott URL-re irányít, `null`/hiba
  esetén a `successUrl`-re. A `termekleiras-diagnozis` ezzel POST-ol az app
  `AUDIT_HANDOFF_ENDPOINT`-jára (e-mail + hozzájárulás, boltmotor, utm) — így az **e-mail nem kerül
  URL-be**, a kuponkód magától kimegy, és az elemzésből lead lesz a pontszámmal. ⚠️ **Titok nélkül,
  a böngészőből hívjuk:** a doksi eredetileg szerver-oldali `Bearer`-t írt elő, de ez a honlap
  statikus. Az app végpontja 2026-08-10 óta ezért kínál egy második, origin-allowlistes +
  rate-limitelt bejáratot is — az `INTAKE_ENDPOINT` bevett mintája szerint. Részletek a `forms.ts`
  `AUDIT_HANDOFF_ENDPOINT` kommentjében és az app `docs/shopgrade-audit-landing-integracio.md`-jében.
- A kapcsolat-űrlapok (`kapcsolat`/`contact`) saját, rövid inline scriptet használnak, de szintén a
  `window.cnIntake`-en mennek – URL ott sincs.

**Ami oldalanként eltér, azt a MARKUP hordozza, nem a script:**

- a minősítő kérdéseket a `.form-step[data-step="1"]` alatti `name`-es mezőkből olvassuk ki
  (`has_webshop`, `marketing_level`, `product_count`, `blog_frequency`, `markets`, `marketing_role`, `timing`),
- a kiszűrés szabályát az **`<option data-reject="hard|soft">`** attribútum mondja meg. Ha valaki
  átfogalmaz egy választ, a szabály vele együtt mozog — korábban ez kézzel másolt JS-szövegkonstansokban
  élt, és némán elromlott.
- a gyűjtő **mezőnként EGY értéket** olvas (`el.value`), ezért többválasztós kérdéshez jelölőnégyzetek
  kellenek `name` NÉLKÜL, plusz egy rejtett `name`-es mező, amibe egy rövid `is:inline` script összefűzi
  a kipipáltakat (lásd `module_interest` a `teljes-rendszer`/`all-in-one` oldalpáron). Ha a
  jelölőnégyzetek maguk kapnának `name`-et, a gyűjtő a kipipálatlanokat is kitöltöttnek látná, és csak
  az utolsó érték maradna meg.

**A négy `statusz` ág:** `hard_reject` (csak minősítő válaszok, nincs kapcsolati adat) · `soft_reject`
(e-mail + hírlevél-opt-in) · `sikeres` (teljes adat, majd átirányítás `/hu/koszonjuk/?lead=1`-re) ·
`kapcsolat`. Minden beküldés visz `submission_id`-t (UUID, **idempotencia-kulcs**), `nyelv`-et,
`adatkezeles`-t és üres `website` honeypotot. **Az EN oldal is a magyar `lead_forras` kulcsot küldi**
(`/en/shopgrade` → `shopgrade`); a nyelvet a `nyelv` mező hordozza. Ugyanezért maradnak magyarok az EN
`module_interest` jelölőnégyzeteinek `value`-i is: a két nyelv válaszai egy oszlopban szűrhetők.
**Új `lead_forras` felvételekor** az app oldalán is érdemes bővíteni a `FORM_LABELS` és `PATH_TO_FORRAS`
táblákat (`src/lib/admin/lead-submission-fields.ts`) — enélkül működik, csak a nyers kulcs látszik
címke helyett.

**"Ne vesszen el semmi":** a beküldés a küldés ELŐTT bekerül a `localStorage` retry-sorba
(`cn_intake_queue_v1`), a `fetch` `keepalive`-val megy, és ami kint marad, azt a következő oldalbetöltés
újraküldi ugyanazzal a `submission_id`-vel (az app dedupál). A felhasználót nem várakoztatjuk: a sikeres
ág legfeljebb 2 másodpercet vár, aztán mindenképp átirányít.

## Hírlevél-feliratkozás – KÜLÖN út, nem a lead-intake

> 🔴 **Jelenleg KI VAN KAPCSOLVA** (`NEWSLETTER_LIVE = false` a `src/data/newsletter.ts`-ben):
> 2026-08-29-én az app csapata jelezte, hogy a végpont még nem létezik. Amíg a flag `false`, a
> `NewsletterForm` sem űrlapot, sem küldő scriptet nem renderel (ellenőrizve a build kimenetén), a
> `/hu/hirlevel-feliratkozas/` oldal `noindex`, és a sitemap-bejegyzése ki van kommentelve.
> **Élesítés:** flag `true` + a sitemap-blokk visszatétele.

A **saját hírlevelünkre** való feliratkozás nem a lead-űrlapok végpontjára megy, hanem a
`POST https://app.getcontentninja.com/api/newsletter/subscribe` címre. Azért külön, mert az app itt
mást csinál: külön napló-táblába ír (bizonyíthatóság), és a címet felteszi a MailerLite-ba. A
MailerLite API-kulcs soha nem kerülhet ebbe a repóba (statikus honlap, nem tud titkot tartani) —
ezért megy minden az appon keresztül. A feliratkozás **nem lead**: nem jelenik meg a lead-adminban.

- **`src/data/newsletter.ts`** – az igazságforrás: végpont, `source_form` kulcsok, retry-beállítás és
  a `NEWSLETTER_CONSENT_TEXT`.
- **`src/components/NewsletterForm.astro`** – markup + szállítás egyben. Props: `locale`, `source`,
  `variant` (`card` | `compact`), `heading`, `note`. Egy oldalon több példány is lehet (a
  `define:vars` IIFE-je miatt nem ütköznek), mindegyik saját gyökér-id-t kap.
- ⚠️ **A `consent_text` mező és a gomb fölött látható mondat UGYANAZ a konstans.** Nem összefoglaló,
  hanem betűhű szöveg: ha egy év múlva megkérdezik, mire mondott igent a feliratkozó, a napló
  önmagában bizonyít. Egy helyen él, tehát a kettő nem tud elcsúszni — ha átírod, mindkettő változik.
- ⚠️ **Egylépcsős feliratkozás: nincs megerősítő levél.** A brief eredetileg dupla opt-int írt le, de
  az app csapata 2026-08-29-én elvetette (lemorzsol; a hozzájárulást a gomb megadja, a
  bizonyíthatóságot a napló-tábla). A siker-szöveg ezért „Kész, feliratkoztál!” — **ne írd vissza
  „Már csak egy lépés”-re**, mert olyan levelet ígérne, ami sosem érkezik meg. Emiatt a brief §5
  indoklása is elavult: a hamis címeket ott a megerősítő levél szűrte volna, most a honlapon már
  csak a honeypot van (a rate limit az app oldalán marad).
- **Retry:** 3 próba növekvő várakozással, kizárólag 5xx-re és hálózati hibára (a 4xx kliens-hiba),
  mindig UGYANAZZAL a `submission_id`-vel — ez adja az idempotenciát. Ha a látogató javítja az
  e-mail címét egy hiba után, új `submission_id` generálódik. A `fetch` `keepalive`-val megy.
  Ez a **közös `cnIntake` retry-sorától független** — az másik végpontra van kötve.
- **A válasz mindig `{ ok: true }`**, akkor is, ha a cím már fent volt a listán: különben az űrlapból
  ki lehetne találni, ki szerepel rajta.
- **A meglévő 16 lead-űrlap változatlan:** marad rajtuk a `hirlevel_feliratkozas` pipa, és továbbra is
  az `INTAKE_ENDPOINT`-ra mennek.
- **Még hiányzik a briefből** (§7): lábléc-űrlap minden oldalon, és doboz a blogcikkek alján. A
  `NewsletterForm` `compact` változata pont erre való (`source: 'footer'` / `'blog_alja'`).

**A minősítés-emlékezet** (`cn_qualify_v2`, 30 nap, témánként) a régi „Már elküldve" zár helyett áll: nem
a beküldést, hanem a **minősítés kimenetelét** jegyzi meg, hogy a kiszűrt látogató ne tudja újratöltéssel,
más válaszokkal végigpróbálni az űrlapot. Sikeres beküldés után **nincs** zár (az app dedupál, és aki
elgépelte az adatait, javíthasson). Kliens-oldali emlékezet: inkognitóval megkerülhető — a cél a súrlódás.
**Ha a kiszűrés szabálya lazul, emeld a kulcs verziószámát** (`forms.ts`) — különben a régi kimenetel 30
napig kizárva tartja azt is, akit már átengednénk.
