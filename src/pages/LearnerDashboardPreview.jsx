import React,{useEffect,useState} from 'react';
import {matchesProfile,isExamLevel} from '../learner-content';
import {Link} from 'react-router-dom';
import Seo from '../Seo.jsx';
import View from './LearnerDashboardView';
// PREVIEW ONLY. Every number below is made-up sample data for layout review. Nothing here is a real learner.
const d=new Date();const days=[...Array(7)].map((_,i)=>new Date(d-(6-i)*864e5).toISOString().slice(0,10));
const DATA={empty:false,tests:9,accuracy:68,minutes:214,streak:4,week:days.map((date,i)=>({date,tests:[1,0,2,1,0,3,2][i]})),sections:[{name:'General Intelligence and Reasoning',accuracy:74,attempted:60},{name:'Quantitative Aptitude',accuracy:52,attempted:40},{name:'English Comprehension',accuracy:71,attempted:35}]};
const ATT=[{attemptId:'p1',title:'Sample result A',submittedAt:d.toISOString(),score:31,maxScore:50,correct:18,wrong:5,total:25,seconds:720},{attemptId:'p2',title:'Sample result B',submittedAt:new Date(d-864e5).toISOString(),score:18,maxScore:40,correct:11,wrong:7,total:20,seconds:660}];
export default function LearnerDashboardPreview(){
 const [cat,setCat]=useState({quizzes:[],notes:[]});useEffect(()=>{fetch('/api/learn/catalog').then(r=>r.json()).then(setCat).catch(()=>{})},[]);const P={level:'exam',target:'SSC CGL',subject:'Reasoning'};const dq=cat.quizzes.filter(q=>matchesProfile(q,P)&&!isExamLevel(q));const dn=cat.notes.filter(n=>matchesProfile(n,P));
 return <div className="learn-shell ld-shell"><Seo title="Learner dashboard preview | Tutor49" noindex/><header className="learn-header"><Link className="learn-logo" to="/">TUTO₹<span>49</span></Link><nav aria-label="Main navigation"><Link to="/learn">Learn</Link></nav></header>
  <main className="learn-main"><p className="ld-banner" role="note"><b>PREVIEW ONLY.</b> Sample numbers for layout review. No sign-in, no real learner data.</p>
  <View quizzes={dq} libNotes={dn} name="Sample Learner" data={DATA} attempts={ATT} notes={[{id:'n1',title:'Sample note',lastOpenedAt:d.toISOString()}]}/></main></div>}
