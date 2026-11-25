import React,{useEffect,useRef,useState} from 'react';
import {api,loadScript,setCsrf} from './learner-session';
export function GoogleSignIn({onSignedIn}){
 const box=useRef(null),cb=useRef(onSignedIn),[error,setError]=useState(''),[busy,setBusy]=useState(true);cb.current=onSignedIn;
 useEffect(()=>{let cancelled=false;(async()=>{try{const b=await api('/bootstrap',{root:'/api/tutor-account'});await loadScript('https://accounts.google.com/gsi/client','t49-google');if(cancelled)return;
  window.google.accounts.id.initialize({client_id:b.googleClientId,nonce:b.nonce,auto_select:false,callback:async({credential})=>{setError('');try{const s=await api('/google',{method:'POST',root:'/api/tutor-account',body:{credential}});setCsrf(s.csrfToken||'');cb.current?.()}catch(e){setError(e.message)}}});
  window.google.accounts.id.renderButton(box.current,{type:'standard',theme:'outline',size:'large',text:'continue_with',width:Math.min(300,window.innerWidth-90)})}catch(e){if(!cancelled)setError(e.message||'Google sign-in could not load.')}finally{if(!cancelled)setBusy(false)}})();return()=>{cancelled=true}},[]);
 return <div className="ld-google"><div ref={box} aria-label="Sign in with Google"/>{busy&&<p className="learn-small">Loading Google sign-in...</p>}{error&&<p role="alert" className="learn-notice">{error}</p>}</div>}
export function SignInGate({title='Sign in to continue',onClose,onSignedIn}){
 return <div className="ld-gate" role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="ld-gate-title" className="ld-gate-box"><h2 id="ld-gate-title">{title}</h2><p className="learn-small">Practice tests and notes are free. Sign in with Google so your results and progress are saved to your own dashboard. We keep only your name, email and your practice results. Nothing is shared with tutors or parents.</p><GoogleSignIn onSignedIn={onSignedIn}/><button className="learn-text-button" onClick={onClose}>Not now</button></section></div>}
