import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';

// Effects do not run at build time: no API requests or private data are baked in.
export function render(url) {
  return renderToString(<StaticRouter location={url}><App /></StaticRouter>);
}
