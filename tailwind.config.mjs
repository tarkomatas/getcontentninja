/**
 * Build-lépéses Tailwind – csak azoknak az oldalaknak, amelyek a `BaseLayout`
 * `tailwindCdn={false}` propjával kérik, és importálják a
 * `src/styles/tailwind.css`-t. A többi oldal továbbra is a CDN-t használja.
 *
 * A verziók a CDN-éivel azonosak (tailwindcss 3.4.17, forms 0.5.10,
 * container-queries 0.1.1), és a téma ugyanabból a fájlból jön, így a két út
 * ugyanazt a CSS-t adja.
 *
 * A `content` az egész `src/`-t és a `cookie.js`-t nézi: egy komponens
 * osztályai bármelyik oldalon megjelenhetnek. Ezért osztálynevet ne rakj össze
 * darabokból (`bg-${szin}`) – azt a build nem látja, a CDN igen.
 */
import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';
import { tailwindTheme } from './src/styles/tailwind-theme.mjs';

export default {
  content: ['./src/**/*.{astro,html,js,mjs,ts}', './public/assets/cookie.js'],
  theme: tailwindTheme,
  plugins: [forms, containerQueries],
};
