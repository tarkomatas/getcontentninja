/**
 * Build-ellenőrzés: minden kész HTML-oldal Material Symbols ikonja szerepel-e a
 * `src/data/icons.ts` listában. Ha nem, a build hibával megáll – különben az
 * ikon helyén élesben a neve jelenne meg szövegként („check_circle").
 *
 * Az `astro:build:done` hookon fut, tehát akárhogy indul a build (helyben vagy
 * a GitHub Actions-ben), lefut.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function listedIcons(root) {
  const src = fs.readFileSync(path.join(root, 'src/data/icons.ts'), 'utf8');
  const body = src.slice(src.indexOf('['), src.lastIndexOf(']'));
  // csak a nem kikommentelt sorok idézőjeles nevei
  const live = body.split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n');
  return new Set([...live.matchAll(/'([a-z0-9_]+)'/g)].map((m) => m[1]));
}

function htmlFiles(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) htmlFiles(p, out);
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

export default function iconCheck() {
  let root;
  return {
    name: 'icon-check',
    hooks: {
      'astro:config:done': ({ config }) => { root = fileURLToPath(config.root); },
      'astro:build:done': ({ dir, logger }) => {
        const known = listedIcons(root);
        const distDir = fileURLToPath(dir);
        const missing = new Map();
        for (const file of htmlFiles(distDir)) {
          const html = fs.readFileSync(file, 'utf8');
          for (const m of html.matchAll(/class="[^"]*material-symbols-outlined[^"]*"[^>]*>\s*([a-z0-9_]+)\s*</g)) {
            if (!known.has(m[1])) {
              const where = missing.get(m[1]) ?? new Set();
              where.add(path.relative(distDir, file).split(path.sep).join('/'));
              missing.set(m[1], where);
            }
          }
        }
        if (missing.size) {
          const lines = [...missing].map(([icon, files]) => `  ${icon}  ←  ${[...files].slice(0, 3).join(', ')}`);
          throw new Error(`Hiányzó ikon(ok) a src/data/icons.ts listából:\n${lines.join('\n')}`);
        }
        logger.info(`ikonok rendben (${known.size} a listában)`);
      },
    },
  };
}
