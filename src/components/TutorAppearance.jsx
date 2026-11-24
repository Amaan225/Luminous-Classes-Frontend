import React,{useEffect,useState} from 'react';
import {Sun,Moon,Monitor} from 'lucide-react';
const KEY='t49-tutor-appearance';
export function isTutorDark(mode,date=new Date()){return mode==='dark'||(mode==='auto'&&(date.getHours()>=18||date.getHours()<6));}
export function useTutorAppearance(){
 const [mode,setMode]=useState(()=>{try{const m=localStorage.getItem(KEY);return ['light','dark','auto'].includes(m)?m:'auto'}catch{return 'auto'}});
 const [now,setNow]=useState(()=>new Date());
 useEffect(()=>{try{localStorage.setItem(KEY,mode)}catch{}},[mode]);
 useEffect(()=>{const update=()=>setNow(new Date());const id=setInterval(update,1000);document.addEventListener('visibilitychange',update);window.addEventListener('focus',update);return()=>{clearInterval(id);document.removeEventListener('visibilitychange',update);window.removeEventListener('focus',update)}},[]);
 return {mode,setMode,dark:isTutorDark(mode,now)};
}
export default function TutorAppearance({appearance}){return <div className="tutor-appearance-bar"><div role="group" aria-label="Tutor appearance" className="tutor-appearance">{[['light',Sun,'Light'],['dark',Moon,'Dark'],['auto',Monitor,'Auto']].map(([id,Icon,label])=><button type="button" key={id} aria-pressed={appearance.mode===id} onClick={()=>appearance.setMode(id)} title={id==='auto'?'Auto: dark 6pm to 6am in your device time':label+' appearance'}><Icon size={16} aria-hidden="true"/>{label}</button>)}</div></div>}
