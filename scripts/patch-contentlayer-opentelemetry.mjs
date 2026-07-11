import fs from 'node:fs';
import path from 'node:path';

const target = path.join(
  process.cwd(),
  'node_modules',
  '@contentlayer2',
  'utils',
  'dist',
  'tracing-effect',
  'index.js'
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const source = fs.readFileSync(target, 'utf8');
const needle = "import { Resource } from '@opentelemetry/resources';";
const replacement = [
  "import resourcesPkg from '@opentelemetry/resources';",
  'const { Resource } = resourcesPkg;',
].join('\n');

if (source.includes(replacement)) {
  process.exit(0);
}

if (!source.includes(needle)) {
  console.warn('[patch-contentlayer] no patch applied; import line not found');
  process.exit(0);
}

fs.writeFileSync(target, source.replace(needle, replacement));
console.log('[patch-contentlayer] patched @contentlayer2/utils/tracing-effect');
