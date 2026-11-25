import React,{useCallback,useEffect,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import LearnHeaderAuto from '../components/LearnHeader';
import Seo from '../Seo.jsx';
import LoadingState from '../components/LoadingState';
import {ACCOUNTS,api,useLearnerAccount} from '../learner-session';
import {SignInGate} from '../learner-account.jsx';
import View from './LearnerDashboardView';
import {matchesProfile,isExamLevel} from '../learner-content';
const DIFF={easy:1,moderate:2,hard:3};
function readProfile(){try{const p=JSON.parse(localStorage.getItem('t49-learn-profile-v1'));if(p&&p.level&&p.target&&p.subject)return p}catch{/* no saved profile */}return {level:'school',target:'Class 8',subject:'Mathematics'}}
export default function LearnerDashboard(){
 const acct=useLearnerAccount(),nav=useNavigate();const [d,setD]=useState(null),[attempts,setAttempts]=useState([]),[notes,setNotes]=useState([]),[pending,setPending]=useState(null),[err,setErr]=useState(''),[msg,setMsg]=useState(''),[loading,setLoading]=useState(true),[prof,setProf]=useState('');
 const [cat,setCat]=useState({quizzes:[],notes:[]});useEffect(()=>{let live=true;fetch('/api/learn/catalog').then(r=>r.ok?r.json():null).then(c=>{if(live&&c&&Array.isArray(c.quizzes)&&Array.isArray(c.notes))setCat(c)}).catch(()=>{});return()=>{live=false}},[]);
 const prof2=readProfile();const dq=cat.quizzes.filter(q=>matchesProfile(q,prof2)&&!isExamLevel(q)).map((q,i)=>[q,i]).sort((a,b)=>(DIFF[a[0].difficulty]||9)-(DIFF[b[0].difficulty]||9)||a[1]-b[1]).map(x=>x[0]);const dn=cat.notes.filter(n=>matchesProfile(n,prof2));
 const load=useCallback(async()=>{setLoading(true);setErr('');try{const me=await api('/me');setProf(me.name);setPending(me.deleteRequestedAt);if(me.deleteRequestedAt){setD({empty:true});setAttempts([]);setNotes([])}else{const [a,b,c]=await Promise.all([api('/dashboard'),api('/attempts?limit=20'),api('/notes')]);setD(a);setAttempts(b.attempts);setNotes(c.notes)}}catch(e){setErr(e.message)}finally{setLoading(false)}},[]);
 useEffect(()=>{if(acct.status==='in')load();else if(acct.status!=='loading')setLoading(false)},[acct.status,load]);
 async function exportData(){try{const r=await api('/data/export',{raw:true});if(!r.ok)throw Error('Could not export your data.');const url=URL.createObjectURL(await r.blob()),a=document.createElement('a');a.href=url;a.download='tutor49-learner-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}catch(e){setMsg(e.message)}}
 async function act(path,text){try{const r=await api(path,{method:'POST'});setMsg(text);await load();return r}catch(e){setMsg(e.message)}}
 return <div className="learn-shell ld-shell"><Seo title="Your learner dashboard | Tutor49" noindex/><LearnHeaderAuto current="dashboard"/>
  <main className="learn-main">
  {!ACCOUNTS||acct.status==='unavailable'||acct.status==='off'?<section className="ld-empty"><h1>Dashboard unavailable</h1><p className="learn-small">Sign-in is not available right now. You can still use Learn without an account.</p><Link className="learn-button" to="/learn">Back to Learn</Link></section>
  :acct.status==='loading'||loading?<LoadingState label="Loading your dashboard..." skeleton/>
  :acct.status==='out'?<section className="ld-empty"><h1>Sign in to see your dashboard</h1><p className="learn-small">Your results and progress are saved to your own account.</p><SignInGate title="Sign in with Google" onClose={()=>nav('/learn')} onSignedIn={acct.refresh}/></section>
  :err?<section className="ld-empty"><p role="alert" className="learn-notice">{err}</p><button className="learn-button" onClick={load}>Try again</button></section>
  :<View quizzes={dq} libNotes={dn} name={prof||acct.name} data={d} attempts={attempts} notes={notes} message={msg} deleteRequestedAt={pending} onOpenAttempt={id=>nav('/learn?view=results&attempt='+id)} onSignOut={async()=>{await acct.signOut();nav('/learn')}} onExport={exportData} onDeleteRequest={()=>act('/data/delete-request','Deletion requested. Your data stays hidden until it is processed. You can cancel.')} onDeleteCancel={()=>act('/data/delete-cancel','Deletion cancelled. Your data is back.')}/>}
  </main></div>}
