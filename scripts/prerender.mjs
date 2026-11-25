import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { render } from '../.prerender/entry-server.js';
import { SITE, routeMetadata } from '../src/routeMetadata.js';

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
