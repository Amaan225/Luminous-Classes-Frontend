import React,{useEffect,useState} from 'react';
import {Sun,Moon,Monitor} from 'lucide-react';
const KEY='t49-tutor-appearance';
export function isTutorDark(mode,date=new Date()){return mode==='dark'||(mode==='auto'&&(date.getHours()>=18||date.getHours()<6));}
export function useTutorAppearance(){
 const [mode,setMode]=useState('auto');
 const [ready,setReady]=useState(false);
 const [now,setNow]=useState(()=>new Date());
 useEffect(()=>{try{const m=localStorage.getItem(KEY);if(['light','dark','auto'].includes(m))setMode(m)}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(KEY,mode)}catch{}},[mode,ready]);
 useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,1000);document.addEventListener('visibilitychange',update);window.addEventListener('focus',update);return()=>{clearInterval(id);document.removeEventListener('visibilitychange',update);window.removeEventListener('focus',update)}},[]);
 return {mode,setMode,dark:isTutorDark(mode,now)};
}
const ORDER=['light','dark','auto'];const LABEL={light:'Light',dark:'Dark',auto:'Auto'};const ICON={light:Sun,dark:Moon,auto:Monitor};
export default function TutorAppearance({appearance}){const next=ORDER[(ORDER.indexOf(appearance.mode)+1)%3];const Icon=ICON[appearance.mode]||Monitor;return <button type="button" className="tutor-theme-fab" onClick={()=>appearance.setMode(next)} aria-label={'Appearance: '+LABEL[appearance.mode]+'. Switch to '+LABEL[next]} title={appearance.mode==='auto'?'Auto: dark 6pm to 6am in your device time. Click for Light.':LABEL[appearance.mode]+'. Click for '+LABEL[next]+'.'}><Icon size={20} aria-hidden="true"/></button>}
