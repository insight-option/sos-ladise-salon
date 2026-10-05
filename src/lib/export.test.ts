import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { flattenPrefetch } from '../../scripts/flatten-prefetch.mjs';

describe('flattenPrefetch', () => {
  it('copies nested segment payloads to the flat names the router requests', () => {
    const out = mkdtempSync(join(tmpdir(), 'soso-out-'));
    const nested = join(out, 'ar', 'services', '__next.$d$locale', 'services');
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(nested, '__PAGE__.txt'), 'payload');
    writeFileSync(join(out, 'ar', 'services', '__next._tree.txt'), 'tree');

    expect(flattenPrefetch(out)).toBe(1);
    const flat = join(out, 'ar', 'services', '__next.$d$locale.services.__PAGE__.txt');
    expect(readFileSync(flat, 'utf8')).toBe('payload');
    // Originals stay, and top-level payloads are left alone.
    expect(existsSync(join(nested, '__PAGE__.txt'))).toBe(true);
    // Idempotent.
    expect(flattenPrefetch(out)).toBe(0);
  });
});
