import {useCallback,useEffect,useState} from 'react';
// Learner sign-in uses the same Google account session as the tutor area (cookie + CSRF). It never creates a second login.
export const ACCOUNTS=import.meta.env.VITE_TUTOR_ACCOUNTS_ENABLED==='true';
let csrf='';
export const setCsrf=v=>{csrf=v};
export async function api(path,{method='GET',body,root='/api/learn/me',raw=false}={}){
 const r=await fetch(root+path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json',...(csrf?{'X-CSRF-Token':csrf}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 if(raw)return r;let d={};if(r.status!==204){try{d=await r.json()}catch{d={}}}
 if(!r.ok){const e=new Error(d.error||'Could not complete the request. Please retry.');e.status=r.status;e.data=d;throw e}return d}
export function loadScript(src,id){return new Promise((resolve,reject)=>{const old=document.getElementById(id);if(old?.dataset.ready)return resolve();if(old){old.addEventListener('load',resolve,{once:true});old.addEventListener('error',reject,{once:true});return}const s=document.createElement('script');s.id=id;s.src=src;s.async=true;s.onload=()=>{s.dataset.ready='true';resolve()};s.onerror=reject;document.head.appendChild(s)})}
// status: off (feature flag off) | loading | out | in | unavailable (server has accounts disabled or is unreachable)
export function useLearnerAccount(){
 const [state,set]=useState({status:ACCOUNTS?'loading':'off',name:''});
 const refresh=useCallback(async()=>{if(!ACCOUNTS)return;try{const s=await api('/session',{root:'/api/tutor-account'});csrf=s.csrfToken||'';set({status:'in',name:s.account?.name||'',picture:s.account?.picture||''})}catch(e){csrf='';set({status:e.status===401?'out':'unavailable',name:'',picture:''})}},[]);
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{refresh()},[refresh]);
 const signOut=useCallback(async()=>{try{await api('/logout',{method:'POST',root:'/api/tutor-account'})}catch{/* ignore */}csrf='';set({status:'out',name:'',picture:''})},[]);
 return {...state,refresh,signOut}}
