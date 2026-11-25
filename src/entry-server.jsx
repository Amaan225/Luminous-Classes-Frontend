import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { setLearnSeoData } from './learn-seo-data.js';

// Effects do not run at build time: no API requests or private data are baked in.
export function render(url, learnData = null) {
  setLearnSeoData(learnData);
  return renderToString(<StaticRouter location={url}><App /></StaticRouter>);
}
