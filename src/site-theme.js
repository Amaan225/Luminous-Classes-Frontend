import {useEffect,useState,useSyncExternalStore} from 'react';
// One shared appearance choice for the whole site: Light, Dark or Auto (dark 6 PM to 6 AM on the device clock).
// New visitors get Light. Tutor, Learn, Admin and the public pages use the same key.
export const SITE_THEME_KEY='t49-site-theme-v1';
const LEGACY_TUTOR_KEY='t49-tutor-appearance-v2'; // saved tutor choice from before the shared key; used only when the shared key is empty
export const THEME_ORDER=['light','dark','auto'];
export const THEME_LABEL={light:'Light',dark:'Dark',auto:'Auto'};
export function isDarkNow(mode,date=new Date()){return mode==='dark'||(mode==='auto'&&(date.getHours()>=18||date.getHours()<6))}
export function readSiteMode(){try{const m=localStorage.getItem(SITE_THEME_KEY);if(THEME_ORDER.includes(m))return m;const t=localStorage.getItem(LEGACY_TUTOR_KEY);if(THEME_ORDER.includes(t))return t}catch{/* storage unavailable */}return 'light'}
export function applySiteTheme(dark){document.documentElement.setAttribute('data-site-theme',dark?'dark':'light');document.documentElement.style.colorScheme=dark?'dark':'light'}
export function setSiteMode(m){try{localStorage.setItem(SITE_THEME_KEY,m)}catch{/* storage unavailable */}applySiteTheme(isDarkNow(m));window.dispatchEvent(new Event('t49-site-theme'))}
function subscribe(cb){const st=e=>{if(e.key===SITE_THEME_KEY)cb()};window.addEventListener('t49-site-theme',cb);window.addEventListener('storage',st);return()=>{window.removeEventListener('t49-site-theme',cb);window.removeEventListener('storage',st)}}
// The server snapshot is always light, so prerendered pages hydrate without a mismatch.
export function useSiteTheme(){
 const mode=useSyncExternalStore(subscribe,readSiteMode,()=> 'light');
 const [now,setNow]=useState(()=>new Date());
 useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,30000);document.addEventListener('visibilitychange',update);window.addEventListener('focus',update);return()=>{clearInterval(id);document.removeEventListener('visibilitychange',update);window.removeEventListener('focus',update)}},[]);
 const dark=isDarkNow(mode,now);
 useEffect(()=>{applySiteTheme(dark)},[dark]);
 const next=THEME_ORDER[(THEME_ORDER.indexOf(mode)+1)%3];
 return {mode,dark,next,setMode:setSiteMode,toggle:()=>setSiteMode(next)};
}
