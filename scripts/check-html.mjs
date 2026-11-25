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
console.log('Initial HTML checks passed for all public pages, admin and crawl files.');

const ownerTest=await readFile('dist/tutor-test/index.html','utf8');
assert.ok(ownerTest.includes('noindex,nofollow'));
assert.ok(!ownerTest.includes('googletagmanager'));
assert.ok(!ownerTest.includes('window.dataLayer'));
assert.ok(!ownerTest.includes('checkout.razorpay'));
assert.ok(!ownerTest.includes('rel="canonical"'));
const homeHtml=await readFile('dist/index.html','utf8');
const parentHtml=await readFile('dist/parent/index.html','utf8');
assert.match(homeHtml,/<h1[^>]*>\s*Find a home tutor in Lucknow\s*<\/h1>/);
for(const copy of ['100% Verified','Aadhar-verified','Every tutor on our platform is experienced and verified','Zero Commissions'])assert.ok(!homeHtml.includes(copy),`removed unsupported home claim: ${copy}`);
assert.ok(parentHtml.includes('Our team reviews it before sharing it with tutors.'));
assert.ok(!parentHtml.includes('We manually verify the ID of every tutor before they can view'));
assert.match(parentHtml,/<input(?=[^>]*name="salary")(?=[^>]*min="0")[^>]*>/);
const legacy=await readFile('dist/tutor-legacy/index.html','utf8');assert.ok(legacy.includes('noindex'));assert.ok(!legacy.includes('rel="canonical"'));
console.log('Truthful Lucknow copy, preserved budget input and legacy noindex checks passed.');

const learnHtml=await readFile('dist/learn/index.html','utf8');assert.ok(learnHtml.includes('Tell us what you are learning'));assert.ok(homeHtml.includes('href="/learn"'));assert.ok((await readFile('dist/sitemap.xml','utf8')).includes('https://www.tutor49.in/learn'));

// Share previews + structured data: one set per public page, canonical-matching og:url, honest Organization only on home.
for (const [path, meta] of Object.entries(routeMetadata)) {
  const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}/index.html`, 'utf8');
  assert.equal((html.match(/property="og:title"/g) || []).length, 1, `${path}: one og:title`);
  assert.ok(html.includes(`property="og:url" content="${SITE}${path}"`), `${path}: og:url matches canonical`);
  assert.ok(html.includes('name="twitter:card"'), `${path}: twitter card`);
  assert.equal((html.match(/application\/ld\+json/g) || []).length, path === '/' ? 1 : 0, `${path}: JSON-LD only on home`);
}
const ld = JSON.parse((await readFile('dist/index.html', 'utf8')).match(/application\/ld\+json">([^<]*)</)[1]);
assert.ok(ld['@graph'].some((x) => x['@type'] === 'Organization' && !x.address && !x.aggregateRating && !x.telephone), 'Organization has no invented address, rating or phone');
console.log('Share-preview tags and honest Organization JSON-LD checks passed.');
