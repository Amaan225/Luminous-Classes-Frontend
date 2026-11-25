import {useEffect,useState} from 'react';
// One shared Light/Dark choice for the whole site. Default is Light. Tutor and Learn use the same key.
export const SITE_THEME_KEY='t49-site-theme-v1';
export function readSiteTheme(){try{return localStorage.getItem(SITE_THEME_KEY)==='dark'?'dark':'light'}catch{return 'light'}}
export function applySiteTheme(m){document.documentElement.setAttribute('data-site-theme',m);document.documentElement.style.colorScheme=m}
export function setSiteTheme(m){try{localStorage.setItem(SITE_THEME_KEY,m)}catch{/* storage unavailable */}applySiteTheme(m);window.dispatchEvent(new Event('t49-site-theme'))}
export function useSiteTheme(){
 const [mode,setMode]=useState(readSiteTheme);
 useEffect(()=>{applySiteTheme(mode)},[mode]);
 useEffect(()=>{const on=()=>setMode(readSiteTheme());const st=e=>{if(e.key===SITE_THEME_KEY)on()};window.addEventListener('t49-site-theme',on);window.addEventListener('storage',st);return()=>{window.removeEventListener('t49-site-theme',on);window.removeEventListener('storage',st)}},[]);
 return {mode,toggle:()=>setSiteTheme(mode==='dark'?'light':'dark')};
}
