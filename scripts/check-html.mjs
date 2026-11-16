import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SITE, routeMetadata } from '../src/routeMetadata.js';

for (const [path, meta] of Object.entries(routeMetadata)) {
  const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}/index.html`, 'utf8');
  assert.ok(html.includes(`<title>${meta.title}</title>`), `${path}: initial title`);
  assert.ok(html.includes(`content="${meta.description}"`), `${path}: initial description`);
  assert.ok(html.includes(`href="${SITE}${path}"`), `${path}: initial canonical`);
  assert.match(html, /<h1[\s>]/, `${path}: initial page content`);
  assert.ok(!html.includes('<div id="root"></div>'), `${path}: root is not empty`);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${path}: one canonical`);
  assert.ok(!html.includes('content="noindex"'), `${path}: public page is indexable`);
}
const admin = await readFile('dist/admin/index.html', 'utf8');
assert.ok(admin.includes('content="noindex"'));
assert.ok(admin.includes('<div id="root"></div>'));
assert.ok(!admin.includes('rel="canonical"'));
const notFound = await readFile('dist/404.html', 'utf8');
assert.ok(notFound.includes('noindex'));
assert.ok((await readFile('dist/robots.txt', 'utf8')).includes('/sitemap.xml'));
assert.ok((await readFile('dist/sitemap.xml', 'utf8')).includes('<urlset'));
console.log('Initial HTML checks passed for all five public pages, admin and crawl files.');
