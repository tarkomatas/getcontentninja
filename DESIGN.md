# Design tokens & style conventions

Kanonikus stílus-tokenek a Content Ninja landing oldalhoz. **A főoldal (`src/pages/hu/index.astro` / `en/index.astro`) az etalon** — új és szerkesztett oldalak ezekhez igazodjanak, hogy az oldal ne szóródjon szét stílusban.

A tokenek forrása a kódban:
- **Színek / fontok / árnyékok:** inline `tailwind.config` a [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) `<head>`-jében.
- **Gombok / nav / hero-gradient / FAQ / animációk:** [src/styles/global.css](src/styles/global.css).

Ez a fájl a **használati konvenciókat** rögzíti (mit mikor használj), nem definiál új CSS-t.

## Szekciók

| Elem | Token |
|---|---|
| Tartalmi szekció | `py-20 md:py-28` |
| Konténer | `max-w-[1200px] mx-auto px-4 md:px-10` |
| Hero szekció | `py-12 md:py-24` |
| Záró `bg-primary` CTA-sáv | `py-16 md:py-20` (szándékos accent) |

A `px-4 md:px-10` a **konténer `div`-re** kerül akkor is, ha a külső `<section>` elhagyja — így a tartalom bal/jobb éle minden szekcióban illeszkedik.

## Tipográfia

- **Eyebrow felirat:** `text-primary font-bold text-sm uppercase tracking-widest block mb-3` — *nem* `tracking-wider` / `mb-2`.
- **Hero H1:** `font-extrabold` (800) + `tracking-[-0.03em]` — soha `font-black` (900).
- **Általános címsorok:** 700 / `-0.02em` (globálisan a `global.css`-ben).
- **Szekció-címsorok:** `text-3xl md:text-4xl font-bold`.
- **Body szöveg:** `text-body`, `leading-relaxed` / `leading-snug`.

## Kártyák & gombok

- **Kártya:** `bg-card rounded-[16px] border border-border p-8 shadow-card`. Padding mindig `p-8` (vagy `p-5 sm:p-8`), soha `p-7`. A szürke kártya fehér szekción (`bg-light` kártya) is elfogadott natív minta (főoldal vélemény-kártyák).
- **Kis border-radius:** `rounded-[10px]` (gombok, inputok, pill-ek). A radius-skála **10 / 12 / 14 / 16** — nincs `rounded-lg` (8px).
- **Gombok:** `.cta-primary` / `.cta-secondary` / `.cta-on-primary` / `.cta-outline-white` (definíció: `global.css`). Ikonméret a gombokban `text-[16px]` / `text-[18px]`.

## Színek

Csak paletta-tokent használj (`tailwind.config`):

- `primary #6c5ce7`, `dark #1e1e2f` (címsorok), `body #4a4a68` (szöveg), `muted #9090a7`, `light #f8f9fb`, `border #e8e8ef`, `success #22c55e`.
- `light`: `bg-light` — **soha** ne hardcode-old `bg-[#f8f9fb]`-ként.
- `border`: `border-border` — **soha** ne `border-b-[#f3f0f4]`.
- **Pozitív / megerősítő elemek** (badge, összehasonlító tábla „megvan" cellái): `bg-success/10 border-success/20-30 text-success` — nem nyers `green-*`.

**Elfogadott kivételek** (szándékosan nem paletta-token): csillag-értékelés `text-yellow-400`; összehasonlító tábla negatív oldala `red-*`; termék-mockup neutrális `gray-*` placeholderek; dekoratív inline gradientek és scrollbar-szürkék.

## Jogi oldalak

- `.doc-section h2` = `1rem` / 700; body `0.875rem` / `line-height: 1.75`.
- Kulcs/érték címke-oszlop (`.meta-row` grid, illetve `w-44`) = **176px**.

## Ismert, szándékosan nyitva hagyott pontok

- Ikonméret szerepenként változik (16–26px): inline nyíl 16–18, feature-kör 20–22, mockup UI 24–26 — ez a főoldalon is így van, nem hiba.
- **Pénznem:** `en/international` forintban (`Ft`), `en/unas` euróban (`€`) áraz — üzleti/tartalmi döntés, nem stílus. Tisztázandó, melyik a helyes.
