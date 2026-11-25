import {useEffect,useState} from 'react';
// One shared Light/Dark choice for the whole site. Default is Light. Stored under its own key; the Tutor dashboard keeps its own preference for now.
const KEY='t49-site-theme-v1';
export function readSiteTheme(){try{const m=localStorage.getItem(KEY);return m==='dark'?'dark':'light'}catch{return 'light'}}
export function useSiteTheme(){
 const [mode,setMode]=useState(readSiteTheme);
 useEffect(()=>{document.documentElement.setAttribute('data-site-theme',mode);try{localStorage.setItem(KEY,mode)}catch{}},[mode]);
 useEffect(()=>{const on=e=>{if(e.key===KEY)setMode(readSiteTheme())};window.addEventListener('storage',on);return()=>window.removeEventListener('storage',on)},[]);
 return {mode,toggle:()=>setMode(m=>m==='dark'?'light':'dark')};
}
