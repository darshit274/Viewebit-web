// Copies pdfjs-dist's prebuilt worker into public/ as a .js file (instead of
// its native .mjs) so it's served with an unambiguous JavaScript content
// type everywhere. Web servers commonly lack a mime-type mapping for .mjs
// (it's served as application/octet-stream), and browsers refuse to execute
// a Worker script with that content type — silently breaking every PDF
// viewer on the site. Runs automatically before dev/build so it can never
// drift from the installed pdfjs-dist version.
import { copyFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const destDir = join(__dirname, '../public');
const dest = join(destDir, 'pdf.worker.min.js');

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('Copied pdf.js worker -> public/pdf.worker.min.js');
