import React,{useLayoutEffect,useRef,useState} from 'react';

// Hourglass loader by Peter Pong (LottieFiles, Lottie Simple License). lottie-web loads lazily, only while something is really loading.
// One shared, cached load: remounting a loader (route change, account then catalog loading) reuses it, so there is no fallback-to-animation swap.
let libP=null;const loadLib=()=>libP||(libP=Promise.all([import('lottie-web/build/player/lottie_light'),import('../loading-hourglass.json')]).then(([l,d])=>({lottie:l.default,data:d.default})).catch(e=>{libP=null;throw e}));
let libR=null;loadLib().then(r=>{libR=r}).catch(()=>{});
function Hourglass({size}){
 const ref=useRef(null);const [failed,setFailed]=useState(false);
 useLayoutEffect(()=>{let anim,dead=false;const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start=({lottie,data})=>{if(dead||!ref.current)return;anim=lottie.loadAnimation({container:ref.current,renderer:'svg',loop:!reduce,autoplay:!reduce,animationData:data,rendererSettings:{progressiveLoad:false,preserveAspectRatio:'xMidYMid meet'}});if(reduce)anim.goToAndStop(0,true)};
  if(libR)start(libR);else loadLib().then(start).catch(()=>{if(!dead)setFailed(true)});
  return()=>{dead=true;anim?.destroy()}},[]);
 const box={width:size,height:size,minWidth:size,minHeight:size,maxWidth:size,maxHeight:size,position:'relative',overflow:'hidden',contain:'strict'};
 return <span className="t49-hourglass" style={box} aria-hidden="true"><span ref={ref} style={{display:'block',width:size,height:size}}/>{failed&&<svg viewBox="0 0 48 48" width={size} height={size} style={{position:'absolute',inset:0}}><path d="M12 6h24M12 42h24M14 6c0 10 6 14 10 18-4 4-10 8-10 18M34 6c0 10-6 14-10 18 4 4 10 8 10 18" fill="none" stroke="#0b1b33" strokeWidth="3" strokeLinecap="round"/><path d="M19 36h10l-5-7z" fill="#ff5a5f"/></svg>}</span>;
}

// Only mount while a real request is pending. No artificial delay or blocked page overlay.
export default function LoadingState({label='Loading...',inline=false}){
 if(inline)return <span role="status" aria-live="polite" aria-busy="true" className="t49-loading t49-loading-inline"><span className="t49-loading-line"><Hourglass size={30}/><span>{label}</span></span></span>;
 return <div role="status" aria-live="polite" aria-busy="true" className="t49-loading t49-loading-block t49-loading-full"><Hourglass size={220}/><span className="t49-sr">{label}</span></div>;
}
