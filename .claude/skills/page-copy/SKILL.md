---
name: page-copy
description: Copywriting rules for the Content Ninja landing site (hero formula, clarity over cleverness). Use whenever planning, writing, reviewing, or editing a landing page, a hero section, headlines, or marketing copy — load BEFORE drafting any page structure or copy.
---

# Page copy rules

Marketing copy conventions for this site. Always apply these when designing a new page or
touching existing copy. Every rule applies to **both locales** — write HU and EN in sync.

## The golden rule

**Clarity beats cleverness.** The 5-second test: a cold visitor (e.g. arriving from an ad,
never heard of Content Ninja) must be able to tell from the hero alone:

1. **Mi ez?** — product category
2. **Kinek szól?** — target audience
3. **Mit csinál?** — concrete function
4. **Mi a következő lépés?** — CTA

If any of these only becomes clear further down the page, the hero fails.

## Hero formula

Top to bottom:

| Element | Role | Rule |
|---|---|---|
| Eyebrow badge | use case / context | e.g. „Nemzetközi terjeszkedés" — short label, icon + uppercase |
| **H1** | **kategória + célcsoport + funkció** | one sentence, ~8–12 words; NO benefit-only slogans, NO wordplay |
| Subhead | mechanism | 1 sentence: how it works; the clever slogan may open it |
| Checklist | proof points / objection handling | details and objections live here, not in H1/subhead |
| Platform chips | concrete channels | named platforms (Facebook, Instagram, Hírlevél), not generic "social" |
| Social proof | trust | e.g. „50+ hazai webshop már használja" |

### H1 rules

- Pattern: `<kategória> <célcsoportnak>, ami <konkrét funkció>`
  - Etalon (HU, /hu/nemzetkozi): „AI marketing rendszer <span class="text-primary">webshopoknak</span>, ami minden piacodon <span class="text-primary">posztol és hírlevelez</span>"
  - Etalon (EN): "An AI marketing system <span class="text-primary">for webshops</span> that <span class="text-primary">posts and sends newsletters</span> in every market"
- Short form: on focused subpages (integration/solution pages) the function clause may be
  dropped — `<kategória> <célcsoportnak>` alone, e.g. „AI marketing rendszer
  <span class="text-primary">UNAS webshopoknak</span>" — IF the subhead states the concrete
  function in its first clause. Prefer the shorter H1 when in doubt.
- Highlight the **audience** and the **concrete functions** with `text-primary` — the eye
  must land on them first.
- Keep it short. If it doesn't fit in ~12 words, move the rest to the subhead.
- Benefit slogans („Írd meg egyszer. Add el minden piacon.") are forbidden as H1 — they
  don't say what the product is. Demote them to the subhead's opening clause.

### Subhead rules

- Exactly one sentence: the mechanism (input → what the system does → output).
- May open with the demoted slogan, then the mechanism, e.g.: „Írd meg egyszer magyarul –
  a Content Ninja natív minőségben lefordítja, és automatikusan kiküldi minden ország fiókjába."
- No objection handling here (no „ügynökség nélkül" clauses) — that belongs in the
  checklist or lower sections.

## Balance rule (desktop)

On two-column heroes (content left, form/visual right) the two blocks must be **visually
equal height** in desktop view. The left column may not overflow the right one.

- If the left column runs taller: compress the copy further — trim checklist items (3–4 max),
  shorten the subhead, cut a whole element if needed. Never grow the form to match.
- After any hero copy change, eyeball the page at desktop width (`npm run dev`) and check
  the two columns end at roughly the same line.

## Applying it

- When writing or reviewing ANY hero, run the 5-second test on the H1 **alone**, without
  the subhead — category, audience, function must all be readable from it.
- Edit HU and EN together; keep the two heroes structurally identical (same highlights,
  same clause order where the language allows).
- Visual/layout tokens are in `DESIGN.md` — this skill covers the copy; that file covers
  the styling.