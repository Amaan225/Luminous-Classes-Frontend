import React,{useEffect,useRef} from 'react';

// Hourglass loader by Peter Pong (LottieFiles, Lottie Simple License). lottie-web loads lazily, only while something is really loading.
function Hourglass({size}){
 const ref=useRef(null);
 useEffect(()=>{let anim,dead=false;const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;Promise.all([import('lottie-web/build/player/lottie_light'),import('../loading-hourglass.json')]).then(([l,d])=>{if(dead||!ref.current)return;anim=l.default.loadAnimation({container:ref.current,renderer:'svg',loop:!reduce,autoplay:!reduce,animationData:d.default,rendererSettings:{progressiveLoad:true}});if(reduce)anim.goToAndStop(0,true)}).catch(()=>{});return()=>{dead=true;anim?.destroy()}},[]);
 return <span ref={ref} className="t49-hourglass" style={{width:size,height:size}} aria-hidden="true"/>;
}

// Only mount while a real request is pending. No artificial delay or blocked page overlay.
export default function LoadingState({label='Loading...',skeleton=false,inline=false}){
 return <span role="status" aria-live="polite" aria-busy="true" className={'t49-loading '+(inline?'t49-loading-inline':'t49-loading-block')}><span className="t49-loading-line"><Hourglass size={inline?30:68}/><span>{label}</span></span>{skeleton&&<span className="t49-skeleton-grid" aria-hidden="true">{[0,1,2].map(i=><span className="t49-skeleton-card" key={i}><span/><span/><span/><span/></span>)}</span>}</span>;
}
