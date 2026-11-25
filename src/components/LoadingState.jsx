import React,{useEffect,useRef} from 'react';

// Hourglass loader by Peter Pong (LottieFiles, Lottie Simple License). lottie-web loads lazily, only while something is really loading.
function Hourglass({size}){
 const ref=useRef(null);
 useEffect(()=>{let anim,dead=false;const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;Promise.all([import('lottie-web/build/player/lottie_light'),import('../loading-hourglass.json')]).then(([l,d])=>{if(dead||!ref.current)return;anim=l.default.loadAnimation({container:ref.current,renderer:'svg',loop:!reduce,autoplay:!reduce,animationData:d.default,rendererSettings:{progressiveLoad:true}});if(reduce)anim.goToAndStop(0,true)}).catch(()=>{});return()=>{dead=true;anim?.destroy()}},[]);
 return <span ref={ref} className="t49-hourglass" style={{width:size,height:size}} aria-hidden="true"/>;
}

// Only mount while a real request is pending. No artificial delay or blocked page overlay.
export default function LoadingState({label='Loading...',inline=false}){
 if(inline)return <span role="status" aria-live="polite" aria-busy="true" className="t49-loading t49-loading-inline"><span className="t49-loading-line"><Hourglass size={30}/><span>{label}</span></span></span>;
 return <div role="status" aria-live="polite" aria-busy="true" className="t49-loading t49-loading-block t49-loading-full"><Hourglass size={140}/><span className="t49-sr">{label}</span></div>;
}
