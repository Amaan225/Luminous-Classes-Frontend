import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { render } from '../.prerender/entry-server.js';
import { SITE, routeMetadata } from '../src/routeMetadata.js';

const template = await readFile('dist/index.html', 'utf8');
const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

for (const [path, meta] of Object.entries(routeMetadata)) {
  const body = render(path);
  if (!body.includes('<h1')) throw new Error(`No page heading rendered for ${path}`);
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace('</head>', `    <link rel="canonical" href="${SITE}${path}" />\n  </head>`)
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
await rm('.prerender', { recursive: true, force: true });
