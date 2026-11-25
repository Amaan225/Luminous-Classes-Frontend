import React from 'react';

// Only mount while a real request is pending. No artificial delay or blocked page overlay.
export default function LoadingState({label='Loading...',skeleton=false,inline=false}){
 return <span role="status" aria-live="polite" aria-busy="true" className={'t49-loading '+(inline?'t49-loading-inline':'t49-loading-block')}><span className="t49-loading-line"><span className="t49-loading-spinner" aria-hidden="true"/><span>{label}</span></span>{skeleton&&<span className="t49-skeleton-grid" aria-hidden="true">{[0,1,2].map(i=><span className="t49-skeleton-card" key={i}><span/><span/><span/><span/></span>)}</span>}</span>;
}
