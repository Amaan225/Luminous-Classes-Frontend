import React,{useEffect,useRef,useState} from 'react';

// Hourglass loader by Peter Pong (LottieFiles, Lottie Simple License). lottie-web loads lazily, only while something is really loading.
function Hourglass({size}){
 const ref=useRef(null);const [ready,setReady]=useState(false);
 useEffect(()=>{let anim,dead=false;const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;Promise.all([import('lottie-web/build/player/lottie_light'),import('../loading-hourglass.json')]).then(([l,d])=>{if(dead||!ref.current)return;anim=l.default.loadAnimation({container:ref.current,renderer:'svg',loop:!reduce,autoplay:!reduce,animationData:d.default,rendererSettings:{progressiveLoad:true}});if(reduce)anim.goToAndStop(0,true);setReady(true)}).catch(()=>{});return()=>{dead=true;anim?.destroy()}},[]);
 return <span className="t49-hourglass" style={{width:size,height:size,position:'relative'}} aria-hidden="true"><span ref={ref} style={{display:'block',width:'100%',height:'100%'}}/>{!ready&&<svg viewBox="0 0 48 48" width={size} height={size} style={{position:'absolute',inset:0}}><path d="M12 6h24M12 42h24M14 6c0 10 6 14 10 18-4 4-10 8-10 18M34 6c0 10-6 14-10 18 4 4 10 8 10 18" fill="none" stroke="#0b1b33" strokeWidth="3" strokeLinecap="round"/><path d="M19 36h10l-5-7z" fill="#ff5a5f"/></svg>}</span>;
}

// Only mount while a real request is pending. No artificial delay or blocked page overlay.
export default function LoadingState({label='Loading...',inline=false}){
 if(inline)return <span role="status" aria-live="polite" aria-busy="true" className="t49-loading t49-loading-inline"><span className="t49-loading-line"><Hourglass size={30}/><span>{label}</span></span></span>;
 return <div role="status" aria-live="polite" aria-busy="true" className="t49-loading t49-loading-block t49-loading-full"><Hourglass size={280}/><span className="t49-sr">{label}</span></div>;
}
