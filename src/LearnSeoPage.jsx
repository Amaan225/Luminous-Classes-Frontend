import React,{useEffect,useState} from 'react';
import Seo from './Seo.jsx';
import {buildLearnRoutes,profileLink} from './learn-seo.js';
import {kindLabels,difficultyLabels} from './learner-content.js';
import {getLearnSeoData} from './learn-seo-data.js';
import './learner.css';
export function LearnSeoLinks(){
 const d=getLearnSeoData();const exams=(d?.routes||[]).filter(r=>!r.subject);
 if(!exams.length)return null;
 return <nav className="learn-seo-links" aria-label="Practice by exam"><h2>Practice by exam</h2><ul>{exams.map(r=><li key={r.path}><a href={r.path}>{r.exam}</a></li>)}</ul></nav>;
}
export default function LearnSeoPage({exam,subject}){
 const path='/learn/'+exam+(subject?'/'+subject:'');
 const [routes,setRoutes]=useState(()=>getLearnSeoData()?.routes||null);
 // Build-time data can be stale (an item unpublished after the build). Re-check the live catalog; a route with nothing published turns noindex.
 useEffect(()=>{let live=true;fetch('/api/learn/catalog').then(r=>r.ok?r.json():null).then(c=>{if(!live)return;if(c&&Array.isArray(c.quizzes)&&Array.isArray(c.notes))setRoutes(buildLearnRoutes(c));else setRoutes(old=>old||[])}).catch(()=>{if(live)setRoutes(old=>old||[])});return()=>{live=false}},[]);
 const route=(routes||[]).find(r=>r.path===path);
 if(routes&&!route)return <div className="learn-shell"><Seo title="Not found | Tutor49" noindex/><main className="learn-main"><h1>No practice published here yet</h1><p className="learn-intro">There are no published items for this selection. <a href="/learn">Open the learning library</a>.</p></main></div>;
 if(!route)return <div className="learn-shell"><main className="learn-main"><h1>Loading practice</h1></main></div>;
 const subs=(routes||[]).filter(r=>r.exam===route.exam&&r.subject&&!route.subject);
 const quizzes=route.items.filter(i=>i.type==='quiz'),notes=route.items.filter(i=>i.type==='note');
 return <div className="learn-shell"><Seo title={route.title} description={route.description} path={route.path}/>
  <header className="learn-header"><a className="learn-logo" href="/">TUTO₹<span>49</span></a><nav aria-label="Main navigation"><a href="/parent">Parents</a><a href="/tutor">Tutors</a><a href="/learn">Learn</a></nav></header>
  <main className="learn-main"><nav aria-label="Breadcrumb" className="learn-small"><a href="/learn">Learn</a>{route.subject&&<> / <a href={'/learn/'+exam}>{route.exam}</a></>}</nav>
   <h1>{route.exam}{route.subject?' '+route.subject:''} practice</h1>
   <p className="learn-intro">{route.description}</p>
   {subs.length>0&&<nav aria-label="Subjects" className="learn-seo-links"><h2>By subject</h2><ul>{subs.map(r=><li key={r.path}><a href={r.path}>{r.subject}</a></li>)}</ul></nav>}
   {quizzes.length>0&&<section className="learn-group" aria-label="Timed tests"><h2 className="learn-group-title">Timed tests</h2><div className="learn-quiz-list">{quizzes.map(q=><article className="learn-quiz" key={q.id}><div><h3>{q.title}</h3><p className="learn-kind"><span>{kindLabels[q.kind]||kindLabels.practice}</span>{q.difficulty&&<span className="learn-diff">{difficultyLabels[q.difficulty]}</span>}</p><p>{q.description}</p><div className="learn-metadata"><span>{q.questions} questions</span><span>{q.minutes} minutes</span></div></div></article>)}</div><p><a className="learn-button" href={profileLink(route.exam,route.subject)}>Open these tests</a></p></section>}
   {notes.length>0&&<section className="learn-group" aria-label="Notes"><h2 className="learn-group-title">Notes</h2><ul>{notes.map(n=><li key={n.id}><b>{n.title}</b>{n.description&&<> · {n.description}</>}</li>)}</ul></section>}
   <p className="learn-small">Self-practice on your own device. Not an official exam, and the timer is not a proctored one.</p>
  </main></div>;
}
