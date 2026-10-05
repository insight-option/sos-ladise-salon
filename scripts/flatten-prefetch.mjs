// Next.js 16 static export writes segment prefetch payloads as nested folders, e.g.
//   out/ar/services/__next.$d$locale/services/__PAGE__.txt
// but the client router requests a flat, dot-joined name:
//   out/ar/services/__next.$d$locale.services.__PAGE__.txt
// Static hosts then answer 404 and client-side navigation falls back to full page loads.
// This copies every nested payload to the flat name the browser asks for (originals stay).
import { copyFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import process from 'node:process';

const OUT = join(process.cwd(), 'out');

function walk(dir, visit) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, visit);
    else visit(full);
  }
}

export function flattenPrefetch(outDir) {
  let copied = 0;
  walk(outDir, (file) => {
    const parts = relative(outDir, file).split(sep);
    const i = parts.findIndex((p) => p.startsWith('__next.'));
    // Only files nested *inside* a "__next.*" folder need a flat twin.
    if (i === -1 || i === parts.length - 1) return;
    const flat = join(outDir, ...parts.slice(0, i), parts.slice(i).join('.'));
    if (!existsSync(flat)) {
      copyFileSync(file, flat);
      copied += 1;
    }
  });
  return copied;
}

if (process.argv[1] && process.argv[1].endsWith('flatten-prefetch.mjs')) {
  if (!existsSync(OUT)) {
    console.error('No out/ folder to post-process.');
    process.exit(1);
  }
  console.log(`Prefetch payloads flattened: ${flattenPrefetch(OUT)} file(s).`);
}
