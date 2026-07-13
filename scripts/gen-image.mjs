#!/usr/bin/env node
/**
 * gen-image.mjs — Nano Banana (Google Gemini image models) → PNG/WebP into public/assets/
 *
 * Usage:
 *   node scripts/gen-image.mjs -p "prompt text" -o public/assets/foo.png
 *   node scripts/gen-image.mjs -p "..." -o public/assets/hero.webp -a 16:9
 *   node scripts/gen-image.mjs -p "make the background purple" -o out.png --ref public/assets/logo.webp
 *
 * Flags:
 *   -p, --prompt   (required) text prompt
 *   -o, --out      (required) output file path (.png / .jpg / .webp)
 *   -m, --model    model id (default: env GEMINI_IMAGE_MODEL or gemini-3-pro-image-preview)
 *   -a, --aspect   aspect ratio, e.g. 1:1 | 16:9 | 9:16 | 4:3 | 3:4 (optional)
 *       --ref      reference/input image path for editing or style (repeatable)
 *
 * Auth: GEMINI_API_KEY in the environment or in a .env file at the repo root.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';

// ---- tiny .env loader (KEY=VALUE lines, no deps) ------------------------------
async function loadEnv() {
  const path = resolve(process.cwd(), '.env');
  if (!existsSync(path)) return;
  const text = await readFile(path, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const key = m[1];
    let val = m[2].replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}

// ---- arg parsing --------------------------------------------------------------
function parseArgs(argv) {
  const out = { refs: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '-p': case '--prompt': out.prompt = next(); break;
      case '-o': case '--out': out.out = next(); break;
      case '-m': case '--model': out.model = next(); break;
      case '-a': case '--aspect': out.aspect = next(); break;
      case '--ref': out.refs.push(next()); break;
      default:
        if (a.startsWith('-')) { console.error(`Unknown flag: ${a}`); process.exit(2); }
    }
  }
  return out;
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

async function main() {
  await loadEnv();
  const args = parseArgs(process.argv.slice(2));

  if (!args.prompt || !args.out) {
    console.error('Missing required flags. Need --prompt and --out.\nSee header of scripts/gen-image.mjs for usage.');
    process.exit(2);
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set. Add it to .env (see .env.example).');
    process.exit(1);
  }

  const model = args.model || process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';

  // Build request parts: reference images first (for editing/style), then the prompt.
  const parts = [];
  for (const ref of args.refs) {
    const ext = extname(ref).toLowerCase();
    const mime = MIME[ext];
    if (!mime) { console.error(`Unsupported --ref type: ${ref}`); process.exit(2); }
    const data = await readFile(resolve(process.cwd(), ref));
    parts.push({ inlineData: { mimeType: mime, data: data.toString('base64') } });
  }
  parts.push({ text: args.prompt });

  const body = {
    contents: [{ parts }],
    generationConfig: { responseModalities: ['IMAGE'] },
  };
  if (args.aspect) body.generationConfig.imageConfig = { aspectRatio: args.aspect };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`API error ${res.status}:\n${errText}`);
    process.exit(1);
  }

  const json = await res.json();
  const candParts = json?.candidates?.[0]?.content?.parts || [];
  const imgPart = candParts.find((p) => p.inlineData?.data);
  if (!imgPart) {
    const textPart = candParts.find((p) => p.text)?.text;
    console.error('No image in response.' + (textPart ? `\nModel said: ${textPart}` : `\n${JSON.stringify(json).slice(0, 800)}`));
    process.exit(1);
  }

  const raw = Buffer.from(imgPart.inlineData.data, 'base64');
  const outPath = resolve(process.cwd(), args.out);
  await mkdir(dirname(outPath), { recursive: true });

  const outExt = extname(outPath).toLowerCase();
  const srcMime = imgPart.inlineData.mimeType || 'image/png';
  const wantConvert = (outExt === '.webp' && srcMime !== 'image/webp') ||
                      ((outExt === '.jpg' || outExt === '.jpeg') && srcMime !== 'image/jpeg');

  if (wantConvert) {
    try {
      const { default: sharp } = await import('sharp');
      const img = sharp(raw);
      const buf = outExt === '.webp'
        ? await img.webp({ quality: 82 }).toBuffer()
        : await img.jpeg({ quality: 85 }).toBuffer();
      await writeFile(outPath, buf);
      console.log(`✓ ${args.out} (${(buf.length / 1024).toFixed(0)} KB, converted from ${srcMime} via sharp)`);
      return;
    } catch (e) {
      // sharp not installed → fall back to writing raw bytes and warn.
      const fallback = outPath.replace(/\.(webp|jpe?g)$/i, '.png');
      await writeFile(fallback, raw);
      console.log(`✓ ${fallback} (${(raw.length / 1024).toFixed(0)} KB, raw ${srcMime})`);
      console.warn(`⚠ sharp not available, wrote PNG instead of ${outExt}. Install with: npm i -D sharp`);
      return;
    }
  }

  await writeFile(outPath, raw);
  console.log(`✓ ${args.out} (${(raw.length / 1024).toFixed(0)} KB, ${srcMime})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
