import React,{useCallback,useEffect,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import LearnBottomNav from '../components/LearnBottomNav';
import Seo from '../Seo.jsx';
import LoadingState from '../components/LoadingState';
import {ACCOUNTS,api,useLearnerAccount} from '../learner-session';
import {SignInGate} from '../learner-account.jsx';
import View from './LearnerDashboardView';
export default function LearnerDashboard(){
 const acct=useLearnerAccount(),nav=useNavigate();const [d,setD]=useState(null),[attempts,setAttempts]=useState([]),[notes,setNotes]=useState([]),[pending,setPending]=useState(null),[err,setErr]=useState(''),[msg,setMsg]=useState(''),[loading,setLoading]=useState(true),[prof,setProf]=useState('');
 const load=useCallback(async()=>{setLoading(true);setErr('');try{const me=await api('/me');setProf(me.name);setPending(me.deleteRequestedAt);if(me.deleteRequestedAt){setD({empty:true});setAttempts([]);setNotes([])}else{const [a,b,c]=await Promise.all([api('/dashboard'),api('/attempts?limit=20'),api('/notes')]);setD(a);setAttempts(b.attempts);setNotes(c.notes)}}catch(e){setErr(e.message)}finally{setLoading(false)}},[]);
 useEffect(()=>{if(acct.status==='in')load();else if(acct.status!=='loading')setLoading(false)},[acct.status,load]);
 async function exportData(){try{const r=await api('/data/export',{raw:true});if(!r.ok)throw Error('Could not export your data.');const url=URL.createObjectURL(await r.blob()),a=document.createElement('a');a.href=url;a.download='tutor49-learner-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}catch(e){setMsg(e.message)}}
 async function act(path,text){try{const r=await api(path,{method:'POST'});setMsg(text);await load();return r}catch(e){setMsg(e.message)}}
 return <div className="learn-shell ld-shell"><Seo title="Your learner dashboard | Tutor49" noindex/><header className="learn-header"><Link className="learn-logo" to="/">TUTO₹<span>49</span></Link><nav aria-label="Main navigation"><Link to="/learn">Learn</Link></nav></header>
  <main className="learn-main">
  {!ACCOUNTS||acct.status==='unavailable'||acct.status==='off'?<section className="ld-empty"><h1>Dashboard unavailable</h1><p className="learn-small">Sign-in is not available right now. You can still use Learn without an account.</p><Link className="learn-button" to="/learn">Back to Learn</Link></section>
  :acct.status==='loading'||loading?<LoadingState label="Loading your dashboard..." skeleton/>
  :acct.status==='out'?<section className="ld-empty"><h1>Sign in to see your dashboard</h1><p className="learn-small">Your results and progress are saved to your own account.</p><SignInGate title="Sign in with Google" onClose={()=>nav('/learn')} onSignedIn={acct.refresh}/></section>
  :err?<section className="ld-empty"><p role="alert" className="learn-notice">{err}</p><button className="learn-button" onClick={load}>Try again</button></section>
  :<View name={prof||acct.name} data={d} attempts={attempts} notes={notes} message={msg} deleteRequestedAt={pending} onOpenAttempt={id=>nav('/learn?view=results&attempt='+id)} onSignOut={async()=>{await acct.signOut();nav('/learn')}} onExport={exportData} onDeleteRequest={()=>act('/data/delete-request','Deletion requested. Your data stays hidden until it is processed. You can cancel.')} onDeleteCancel={()=>act('/data/delete-cancel','Deletion cancelled. Your data is back.')}/>}
  </main><LearnBottomNav current="progress"/></div>}
