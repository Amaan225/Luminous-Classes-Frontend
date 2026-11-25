import { useEffect } from 'react';

import { SITE } from './routeMetadata.js';

function setMeta(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

export default function Seo({ title, description, path, noindex = false }) {
  useEffect(() => {
    document.title = title;

    if (description) {
      const d = setMeta('meta[name="description"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'description');
        return m;
      });
      d.setAttribute('content', description);
    }

    const robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) {
      const r = robots || document.createElement('meta');
      r.setAttribute('name', 'robots');
      r.setAttribute('content', 'noindex');
      if (!robots) document.head.appendChild(r);
    } else if (robots) {
      robots.remove();
    }

    const og = (prop, value, attr = 'property') => {
      const el = document.head.querySelector(`meta[${attr}="${prop}"]`);
      if (el && value) el.setAttribute('content', value);
    };
    og('og:title', title); og('twitter:title', title, 'name');
    og('og:description', description); og('twitter:description', description, 'name');
    if (path) og('og:url', SITE + path);

    const existing = document.head.querySelector('link[rel="canonical"]');
    if (path && !noindex) {
      const c = existing || document.createElement('link');
      c.setAttribute('rel', 'canonical');
      c.setAttribute('href', SITE + path);
      if (!existing) document.head.appendChild(c);
    } else if (existing) {
      existing.remove();
    }
  }, [title, description, path, noindex]);

  return null;
}
