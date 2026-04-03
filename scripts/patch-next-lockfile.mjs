/**
 * Patches next/dist/build/lockfile.js to gracefully handle the case where
 * `lockfileTryAcquireSync` is missing from the @next/swc-win32-x64-msvc binary.
 *
 * This is a known bug in Next.js 16.2.2 on Windows: the JS layer calls a native
 * function that was not included in the published Windows binary.
 * See: TypeError: bindings.lockfileTryAcquireSync is not a function
 *
 * Remove this script once Next.js ships a patch that fixes the Windows binary.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const lockfilePath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../node_modules/next/dist/build/lockfile.js'
);

const NEEDLE =
  'if (bindings.isWasm) {';

const PATCHED =
  'if (bindings.isWasm || typeof bindings.lockfileTryAcquireSync !== \'function\') {' +
  '\n            // WASM path or native build missing lockfileTryAcquireSync (e.g. win32' +
  '\n            // binary shipped without this symbol in some @next/swc releases).' +
  '\n            // Skip exclusive locking — safe for local dev.';

let source = readFileSync(lockfilePath, 'utf8');

if (source.includes(PATCHED.slice(0, 60))) {
  console.log('patch-next-lockfile: already applied, skipping.');
  process.exit(0);
}

if (!source.includes(NEEDLE)) {
  console.warn('patch-next-lockfile: patch target not found — Next.js may have been updated. Remove this script.');
  process.exit(0);
}

source = source.replace(NEEDLE, PATCHED);
writeFileSync(lockfilePath, source, 'utf8');
console.log('patch-next-lockfile: applied successfully.');
