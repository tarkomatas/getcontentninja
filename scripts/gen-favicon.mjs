/**
 * Favicon-készlet generálása a `public/assets/logo.webp` bal oldali „CN” jeléből.
 *
 *   npm run gen:favicon
 *
 * Kimenet a `public/` gyökerébe (onnan a domain gyökeréről szolgálódik ki):
 *   favicon.ico (16+32+48)  ·  favicon-16x16.png  ·  favicon-32x32.png
 *   apple-touch-icon.png (180)  ·  icon-192.png  ·  icon.png (512)
 *
 * Csak akkor kell újrafuttatni, ha a logó változik. A `<link rel="icon">` sorok
 * a `src/layouts/BaseLayout.astro`-ban és a `src/pages/index.astro`-ban vannak.
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public/assets/logo.webp');
const OUT = path.join(ROOT, 'public');

// A jel bounding boxa a 4000×1200-as logóban (nem-fehér pixelek szkennelésével mérve).
const CROP = { left: 79, top: 170, width: 854, height: 854 };

const mark = () => sharp(SRC).extract(CROP);

/** Négyzetes PNG a jelből, fehér háttéren, opcionális kerettel. */
const png = (size, { pad = 0 } = {}) =>
  mark()
    .resize(size - 2 * pad, size - 2 * pad, { fit: 'fill', kernel: 'lanczos3' })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: '#ffffff' })
    // Palettás PNG: a jel néhány színből áll, így az 512-es ikon is jóval kisebb.
    .png({ compressionLevel: 9, palette: true, quality: 100, effort: 10 })
    .toBuffer();

/** ICO-konténer PNG-tartalommal (minden mai böngésző és a Windows is olvassa). */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;
  entries.forEach((e, i) => {
    const o = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o); // 0 = 256
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o + 1);
    dir.writeUInt8(0, o + 2); // paletta-méret
    dir.writeUInt8(0, o + 3); // reserved
    dir.writeUInt16LE(1, o + 4); // color planes
    dir.writeUInt16LE(32, o + 6); // bit/pixel
    dir.writeUInt32LE(e.data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += e.data.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

const ico = [];
for (const size of [16, 32, 48]) ico.push({ size, data: await png(size) });
writeFileSync(path.join(OUT, 'favicon.ico'), buildIco(ico));

writeFileSync(path.join(OUT, 'favicon-16x16.png'), await png(16));
writeFileSync(path.join(OUT, 'favicon-32x32.png'), await png(32));
writeFileSync(path.join(OUT, 'icon-192.png'), await png(192));
writeFileSync(path.join(OUT, 'icon.png'), await png(512));
// Az iOS maga kerekíti a sarkot, ezért ez kap egy kis fehér keretet.
writeFileSync(path.join(OUT, 'apple-touch-icon.png'), await png(180, { pad: 14 }));

console.log('Favicon-készlet kész: public/favicon.ico + PNG-k');
