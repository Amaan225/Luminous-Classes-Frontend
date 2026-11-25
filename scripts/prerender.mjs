import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { render } from '../.prerender/entry-server.js';
import { SITE, routeMetadata } from '../src/routeMetadata.js';
import { buildLearnRoutes } from '../src/learn-seo.js';

const template = await readFile('dist/index.html', 'utf8');
const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Share-preview tags (WhatsApp, social) and one honest Organization record on the home page. No invented address, rating or phone.
const social = (path, title, description) => `    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Tutor49" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="${SITE}${path}" />
    <meta property="og:image" content="${SITE}/tutor-icon-512.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />
    <meta name="twitter:image" content="${SITE}/tutor-icon-512.png" />\n`;
const orgJson = `    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Tutor49', url: `${SITE}/`, logo: `${SITE}/tutor-icon-512.png`, description: 'Tutor49 connects parents in Lucknow with home tutors. Parents post a requirement for free and the team reviews it before sharing it with tutors.', areaServed: { '@type': 'City', name: 'Lucknow' } }, { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'Tutor49', url: `${SITE}/`, publisher: { '@id': `${SITE}/#organization` }, inLanguage: 'en-IN' }] })}</script>\n`;

for (const [path, meta] of Object.entries(routeMetadata)) {
  const body = render(path);
  if (!body.includes('<h1')) throw new Error(`No page heading rendered for ${path}`);
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace('</head>', `    <link rel="canonical" href="${SITE}${path}" />\n${social(path, meta.title, meta.description)}${path === '/' ? orgJson : ''}  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  if (!html.includes(`<title>${escape(meta.title)}</title>`) || !html.includes(escape(meta.description))) {
    throw new Error(`Metadata missing for ${path}`);
  }
  const directory = path === '/' ? 'dist' : `dist${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
  console.log(`Rendered ${path}`);
}

// Catalog-backed exam/subject pages: only real published items create a route.
// Source: LEARN_CATALOG_FILE (private local fixtures) or LEARN_CATALOG_URL / the live public catalog on Vercel. Failure skips quietly.
// Returns null only when no source is configured (plain local build). Any configured source that fails or returns a malformed
// body FAILS THE BUILD, so an outage can never silently ship a site without its valid /learn routes. A valid empty catalog is fine.
async function loadCatalog() {
  const file = process.env.LEARN_CATALOG_FILE;
  const url = process.env.LEARN_CATALOG_URL || (process.env.VERCEL ? `${SITE}/api/learn/catalog` : '');
  if (!file && !url) { console.log('Learn SEO routes: no catalog source configured, skipped (local build).'); return null; }
  let body, lastError;
  if (file) body = JSON.parse(await readFile(file, 'utf8'));
  else {
    for (let attempt = 1; attempt <= 4 && !body; attempt++) {
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(60000) });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        body = await r.json();
        break;
      } catch (e) { lastError = e; console.warn(`Learn catalog attempt ${attempt} failed: ${e.message}`); await new Promise((res) => setTimeout(res, Number(process.env.LEARN_CATALOG_RETRY_MS ?? 5000) * attempt)); }
    }
    if (!body) throw new Error(`Learn catalog fetch failed after retries (${lastError?.message}). Refusing to ship without its SEO routes.`);
  }
  const ok = body && Array.isArray(body.notes) && Array.isArray(body.quizzes) && [...body.notes, ...body.quizzes].every((x) => x && typeof x.id === 'string' && typeof x.title === 'string');
  if (!ok) throw new Error('Learn catalog has an unexpected shape. Refusing to ship without validated SEO routes.');
  return body;
}
const learnCatalog = await loadCatalog();
const learnRoutes = learnCatalog ? buildLearnRoutes(learnCatalog) : [];
if (learnRoutes.length) {
  const data = { routes: learnRoutes.map(({ updatedAt, ...r }) => r) };
  const blob = `<script type="application/json" id="learn-seo-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  const page = (path, title, description) => template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(description)}" />`)
    .replace('</head>', `    <link rel="canonical" href="${SITE}${path}" />\n${social(path, title, description)}  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(path, data)}</div>${blob}`);
  const learn = routeMetadata['/learn'];
  await writeFile('dist/learn/index.html', page('/learn', learn.title, learn.description));
  for (const r of learnRoutes) {
    await mkdir(`dist${r.path}`, { recursive: true });
    await writeFile(`dist${r.path}/index.html`, page(r.path, r.title, r.description));
    console.log(`Rendered ${r.path} (${r.items.length} published items)`);
  }
  const base = await readFile('dist/sitemap.xml', 'utf8');
  const extra = learnRoutes.map((r) => `  <url><loc>${SITE}${r.path}</loc>${r.updatedAt ? `<lastmod>${r.updatedAt.slice(0, 10)}</lastmod>` : ''}</url>\n`).join('');
  await writeFile('dist/sitemap.xml', base.replace('</urlset>', `${extra}</urlset>`));
}

// Keep admin client-only and out of the index, even before JavaScript runs.
await mkdir('dist/admin', { recursive: true });
await writeFile('dist/admin/index.html', template
  .replace(/<title>[^<]*<\/title>/, '<title>Admin | Tutor49</title>')
  .replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>'));
// The unlinked owner-only route must not inherit production analytics or checkout preload.
await mkdir('dist/tutor-test',{recursive:true});
await writeFile('dist/tutor-test/index.html',template
 .replace(/<script[^>]*src="https:\/\/www\.googletagmanager\.com[^>]*><\/script>/g,'')
 .replace(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/g,'')
 .replace(/<script[^>]*src="https:\/\/checkout\.razorpay\.com[^>]*><\/script>/g,'')
 .replace(/<title>[^<]*<\/title>/,'<title>Owner test | Tutor49</title>')
 .replace('</head>','<meta name="robots" content="noindex,nofollow" /></head>'));
await mkdir('dist/tutor-legacy',{recursive:true});
await writeFile('dist/tutor-legacy/index.html',template.replace(/<title>[^<]*<\/title>/,'<title>Tuition board | Tutor49</title>').replace('</head>','<meta name="robots" content="noindex" /></head>'));
await rm('.prerender', { recursive: true, force: true });
