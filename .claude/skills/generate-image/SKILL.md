---
name: generate-image
description: Generate images for the Content Ninja landing site with Google's Nano Banana (Gemini image) API and place them into public/assets/. Use whenever the user asks to create, generate, replace, or edit a site image, illustration, hero, icon, or OG image.
---

# Generating images for the site

This site's images live in `public/assets/` and are referenced with plain `<img>` in the
Astro pages. Use the repo script `scripts/gen-image.mjs` to generate them via the Gemini
image API (Nano Banana / Nano Banana Pro), then wire the result into the page.

## Setup (one-time, done by the user)

1. Get a key at https://aistudio.google.com/apikey
2. `cp .env.example .env` and set `GEMINI_API_KEY=...` (`.env` is gitignored — never commit it).

If `GEMINI_API_KEY` is missing the script exits with a clear message — tell the user to set it.

## How to run

```bash
npm run gen:image -- -p "PROMPT" -o public/assets/NAME.webp -a 16:9
# or directly:
node scripts/gen-image.mjs -p "PROMPT" -o public/assets/NAME.png
```

Flags: `-p/--prompt` (required), `-o/--out` (required), `-m/--model`, `-a/--aspect`
(`1:1`,`16:9`,`9:16`,`4:3`,`3:4`), `--ref PATH` (input image to edit/restyle — repeatable).

- Default model is `gemini-3-pro-image-preview` (Nano Banana Pro, "Nano Banana 2"). Override
  with `-m gemini-2.5-flash-image` for faster/cheaper drafts, or via `GEMINI_IMAGE_MODEL`.
- Output to `.webp` for site images. The script converts PNG→WebP with `sharp` if available;
  if `sharp` is missing it writes a `.png` and warns (`npm i -D sharp` to enable conversion).
- **Editing an existing asset:** pass it with `--ref`, e.g.
  `node scripts/gen-image.mjs --ref public/assets/hero_image.jpg -p "same scene, add a subtle purple glow" -o public/assets/hero_v2.webp`.

## The full workflow (what to actually do)

1. **Generate** into `public/assets/` with a descriptive kebab-case filename that matches the
   existing naming (e.g. `skalazhato-marketing.jpg`, `tartalomnaptar.jpg`).
2. **Report size.** The script prints KB — if a hero/full-width image is over ~250 KB,
   regenerate as `.webp` or note it. Keep section images lean.
3. **Wire it in.** Edit the relevant `src/pages/**/*.astro` (or a component) to point the
   `<img src="/assets/NAME.webp">` at it, and **always write meaningful `alt` text in the
   page's locale** (Hungarian for `/hu/`, English for `/en/`). Add `loading="lazy"` and
   explicit `width`/`height` for below-the-fold images to avoid layout shift.
4. **Verify** with `npm run dev` if the change is visual and non-trivial.

## Prompt best practices for THIS site

Content Ninja = AI content generation for **webshops**. The brand is modern, clean, trustworthy.

- **Match the brand palette.** Primary purple `#6c5ce7`, dark `#1e1e2f`, light neutral
  backgrounds. State it in the prompt: *"purple (#6c5ce7) accent, clean white background,
  soft shadows, modern SaaS illustration style."*
- **Keep a consistent style across the set.** Before generating a new section image, look at
  the existing ones (`hero_image.jpg`, `skalazhato-marketing.jpg`, `tartalomnaptar.jpg`,
  `teljes-automatizalas.jpg`, `webshop-hatekonysag.jpg`) and describe the same style so the
  page stays cohesive. Use `--ref` on an existing image to lock the look.
- **Avoid rendered text in images.** Image models still garble words — especially Hungarian.
  Prefer text-free illustrations; put real copy in HTML. If a UI mockup needs labels, keep
  them short/English and proofread the output; Nano Banana Pro renders text far better than
  most, but still verify.
- **Specify aspect ratio** for the slot: hero/full-width `16:9`, square feature icons `1:1`,
  portrait/mobile `9:16`, OG image `16:9` (1200×630-ish).
- **Be concrete about subject, composition, lighting, mood.** e.g. *"flat-design illustration
  of a webshop dashboard auto-generating product descriptions, floating cards, subtle motion
  lines, purple #6c5ce7 accents on white, isometric, friendly, no text."*
- **Iterate cheaply.** Draft with `gemini-2.5-flash-image`, then do the final at
  `gemini-3-pro-image-preview`.

## Notes / troubleshooting

- Model ids evolve. If a model returns 404, tell the user and try the alternate id above.
- The script never touches git. Generated files land in `public/assets/` and get deployed by
  the normal GitHub Actions build on push to `main`.
- Don't commit `.env`; do commit the generated image assets.