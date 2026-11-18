import React from 'react';
export default class TutorAccountBoundary extends React.Component{
 constructor(p){super(p);this.state={failed:false,detail:''};}
 static getDerivedStateFromError(e){return {failed:true,detail:String(e&&e.message||e).slice(0,160)};}
 componentDidCatch(e){try{console.error('Tutor account page error',e)}catch{}}
 render(){
  if(!this.state.failed)return this.props.children;
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><section role="alert" className="max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm"><h1 className="text-2xl font-bold mb-3">Something went wrong</h1><p className="text-slate-600 mb-4">The tutor page could not load. Your Google sign-in is safe and nothing was charged. Please reload and try again.</p><p className="mb-5 break-words text-xs text-slate-400">{this.state.detail}</p><button type="button" onClick={()=>window.location.reload()} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Reload</button><p className="mt-4 text-sm text-slate-500">Still stuck? Email tutor49.official@gmail.com with a screenshot of this message.</p></section></div>;
 }
}
