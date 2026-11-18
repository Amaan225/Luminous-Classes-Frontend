import {defineConfig,loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({mode})=>{
 const env={...loadEnv(mode,process.cwd(),'VITE_'),...process.env};
 const preview=env.VITE_TUTOR_PREVIEW==='true';
 return {plugins:[react(),{name:'tutor-preview-isolation',transformIndexHtml(html){
  if(preview)html=html.replace(/<script[^>]*src="https:\/\/www\.googletagmanager\.com[^>]*><\/script>/g,'').replace(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/g,'').replace(/<script[^>]*src="https:\/\/checkout\.razorpay\.com[^>]*><\/script>/g,'').replace('</head>','<meta name="robots" content="noindex,nofollow" /><meta name="tutor49-preview" content="isolated" /></head>');
  if(env.VITE_TUTOR_ACCOUNTS_ENABLED==='true')html=html.replace('</head>','<link rel="manifest" href="/tutor.webmanifest" /><meta name="theme-color" content="#4f46e5" /><link rel="apple-touch-icon" href="/tutor-icon-192.png" /></head>');
  return html;
 }}],server:{proxy:{'/api':'http://127.0.0.1:5079'}}};
});
