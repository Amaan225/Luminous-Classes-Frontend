import React,{useEffect,useState} from 'react';
import {Sun,Moon,Monitor} from 'lucide-react';
const KEY='t49-tutor-appearance-v2'; // v2: default is Light. The old key held an automatic default for everyone, so it is not carried over.
export function isTutorDark(mode,date=new Date()){return mode==='dark'||(mode==='auto'&&(date.getHours()>=18||date.getHours()<6));}
export function useTutorAppearance(){
 const [mode,setMode]=useState('light');
 const [ready,setReady]=useState(false);
 const [now,setNow]=useState(()=>new Date());
 useEffect(()=>{try{const sm=localStorage.getItem('t49-site-theme-v1');const m=localStorage.getItem(KEY);if(sm==='dark'||sm==='light')setMode(sm);else if(['light','dark','auto'].includes(m))setMode(m)}catch{/* storage unavailable */}setReady(true)},[]);
 useEffect(()=>{const on=()=>{try{const sm=localStorage.getItem('t49-site-theme-v1');if(sm==='dark'||sm==='light')setMode(sm)}catch{/* storage unavailable */}};window.addEventListener('t49-site-theme',on);return()=>window.removeEventListener('t49-site-theme',on)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(KEY,mode);if(mode==='dark'||mode==='light'){localStorage.setItem('t49-site-theme-v1',mode);document.documentElement.setAttribute('data-site-theme',mode);window.dispatchEvent(new Event('t49-site-theme'))}}catch{/* storage unavailable */}},[mode,ready]);
 useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,1000);document.addEventListener('visibilitychange',update);window.addEventListener('focus',update);return()=>{clearInterval(id);document.removeEventListener('visibilitychange',update);window.removeEventListener('focus',update)}},[]);
 return {mode,setMode,dark:isTutorDark(mode,now)};
}
const ORDER=['light','dark','auto'];const LABEL={light:'Light',dark:'Dark',auto:'Auto'};const ICON={light:Sun,dark:Moon,auto:Monitor};
export default function TutorAppearance({appearance,inline=false}){const next=ORDER[(ORDER.indexOf(appearance.mode)+1)%3];const Icon=ICON[appearance.mode]||Monitor;return <button type="button" className={inline?"tutor-theme-btn":"tutor-theme-fab"} onClick={()=>appearance.setMode(next)} aria-label={'Appearance: '+LABEL[appearance.mode]+'. Switch to '+LABEL[next]} title={appearance.mode==='auto'?'Auto: dark 6pm to 6am in your device time. Click for Light.':LABEL[appearance.mode]+'. Click for '+LABEL[next]+'.'}><Icon size={20} aria-hidden="true"/></button>}
