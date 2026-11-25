// PRIVATE local preview only: isolated in-memory DB, never touches production. Source files are read, never modified.
import {createRequire} from 'node:module';import path from 'node:path';import {createServer} from 'vite';import {chromium} from 'playwright';import assert from 'node:assert/strict';import fs from 'node:fs';
const OUT='/downloads/t49-content/out',SRC='/downloads/t49-content/source/00-tutor49_reasoning_sectional_candidates_v3-799e4b9f.json';
const src=JSON.parse(fs.readFileSync(SRC,'utf8'));const log=[];
const NOTE_OLD='(Take the statements as true, and assume every group named has at least one member.)',NOTE_NEW='(Take the statements as true even if they differ from real-world facts, and assume every group named has at least one member.)';
const MIR_OLD=' The other options are turned by a different angle or are mirror images, and the pairwise overlap check shows they are visibly different from each other.',MIR_NEW=' The other options are turned by a different angle.';
const ALT='Figure series for this question: three numbered figures, 1 to 3, and four labelled options, A to D. The figure is part of the question and contains no text hint.';
const quizzes={};
for(const lvl of ['Easy','Moderate','Hard']){const items=src.items.filter(i=>i.level===lvl).sort((a,b)=>a.id.localeCompare(b.id));
const questions=items.map(i=>{let text=i.question_en,sol=i.solution;
if(text.includes(NOTE_OLD)){text=text.replace(NOTE_OLD,NOTE_NEW);log.push({id:i.id,field:'question',rule:'syllogism convention made explicit (true even if contrary to real-world facts)'})}
if(sol.includes(MIR_OLD)){sol=sol.replace(MIR_OLD,MIR_NEW);log.push({id:i.id,field:'solution',rule:'removed mirror-option and overlap-check boilerplate from figure solution'})}
const q={text,options:i.options,answer:i.answer_index,explanation:sol,section:'Reasoning'};
if(i.figure_composite_svg){q.image={src:'data:image/png;base64,'+fs.readFileSync('/downloads/t49-content/figs/'+i.id+'.png').toString('base64'),alt:ALT};log.push({id:i.id,field:'image',rule:'supplied composite SVG rasterised to PNG (supplied figs3 PNG files were not attached); same pixels as supplied overview, labels A-D and 1-3 included'})}
return q});
quizzes[lvl]={title:'Reasoning Sectional Mock Test: '+lvl+' (original practice)',description:'Original practice. English. Provisional editorial difficulty.\n\nOriginal practice questions written for Tutor49, not copied from any past paper. The '+lvl+' label is a provisional editorial judgement, not calibrated against students or any exam, and this set is not an exam-equivalent test. English only. Practice time is 15 minutes, +2 for a correct answer and -0.5 for a wrong answer.',levels:['exam'],targets:['SSC CGL'],subjects:['Reasoning'],topic:'Reasoning',kind:'sectional',difficulty:lvl.toLowerCase(),minutes:15,marks:2,negativeMarks:0.5,published:false,questions}}
fs.mkdirSync(OUT,{recursive:true});for(const [l,q] of Object.entries(quizzes))fs.writeFileSync(`${OUT}/reasoning-${l.toLowerCase()}.json`,JSON.stringify(q,null,1));fs.writeFileSync(OUT+'/transformation-log.json',JSON.stringify({source:SRC,note:'Only the listed edits were made. Answer keys, options and ids order untouched.',edits:log},null,1));
const req=createRequire(path.resolve(process.cwd(),'../tutor49-back/package.json')),express=req('express'),mongoose=req('mongoose'),{MongoMemoryServer}=req('mongodb-memory-server'),{createAdminAuth}=req('./admin-auth'),{createLearnerRouters}=req('./learner-routes'),models=req('./models/learner');
process.env.VITE_TUTOR_ACCOUNTS_ENABLED='true';process.env.VITE_TUTOR_PREVIEW='true';let api,vite,b;const mongo=await MongoMemoryServer.create();await mongoose.connect(mongo.getUri('tutor49_content_preview'));
try{const auth=createAdminAuth(),app=express();app.set('trust proxy',1);app.use(auth.attach);app.use('/api/admin/learner',auth.requireAdmin,express.json({limit:'4mb'}));app.use(express.json({limit:'100kb'}));const r=createLearnerRouters({models});app.use('/api/admin/learner',r.adminRouter);app.use('/api/learn',r.publicRouter);for(const u of ['jobs','unlocks','tutors'])app.get('/api/'+u,(q,s)=>s.json([]));api=app.listen(5079,'127.0.0.1');await new Promise(r=>api.once('listening',r));
const session=auth.issue();const headers={'Content-Type':'application/json',Authorization:'Bearer '+session.token};const call=(p,method='GET',body)=>fetch('http://127.0.0.1:5079'+p,{method,headers,...(body?{body:JSON.stringify(body)}:{})});
const proof={};let ok=0,figs=0,keysOK=0;
for(const [l,q] of Object.entries(quizzes)){const res=await call('/api/admin/learner/quizzes','POST',q);assert.equal(res.status,201,l+' import '+res.status);const j=await res.json();assert.equal((await call('/api/admin/learner/quizzes/'+j.id,'PATCH',{published:true})).status,200);
const pub=await (await fetch('http://127.0.0.1:5079/api/learn/quizzes/'+j.id)).json();const srcItems=src.items.filter(i=>i.level===l).sort((a,b)=>a.id.localeCompare(b.id));
assert.equal(pub.questions.length,25);pub.questions.forEach((x,i)=>{ok++;if(x.answer===srcItems[i].answer_index&&JSON.stringify(x.options)===JSON.stringify(srcItems[i].options))keysOK++;if(x.image)figs++});
proof[l]={id:j.id,count:pub.questions.length,kind:pub.kind,difficulty:pub.difficulty,minutes:pub.minutes,marks:pub.marks,negativeMarks:pub.negativeMarks,figures:pub.questions.filter(x=>x.image).length}}
proof.totals={imported:ok,keysAndOptionsIdenticalToSource:keysOK,figuresRendered:figs,edits:log.length};fs.writeFileSync(OUT+'/import-proof.json',JSON.stringify(proof,null,1));console.log(JSON.stringify(proof));
vite=await createServer({root:process.cwd(),server:{host:'127.0.0.1',port:5194,strictPort:true}});await vite.listen();b=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',args:['--no-sandbox']});
for(const [w,h] of [[390,844],[1280,900]]){const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();await p.goto('http://127.0.0.1:5194/learn');
await p.getByLabel('Learning stage').selectOption('exam');await p.getByLabel('Exam').selectOption('SSC CGL');await p.getByLabel('Subject').selectOption('Reasoning');await p.getByRole('button',{name:'Next'}).click();await p.getByRole('button',{name:/Quiz & practice/}).click();await p.getByRole('tab').first().waitFor();
if(w===390)await p.screenshot({path:'/downloads/c1-list-reasoning-390.png',fullPage:true});else await p.screenshot({path:'/downloads/c1-list-reasoning-1280.png',fullPage:true});
await p.locator('article',{hasText:'Reasoning Sectional Mock Test: Easy'}).getByRole('button',{name:/Start practice/}).click();await p.getByText(/QUESTION 1 OF 25/).waitFor();
// scoring: Q1..3 correct, Q4 wrong, rest skipped. then go to Q17 (figure) and answer wrong
const easy=quizzes.Easy.questions;const pick=async i=>{await p.getByRole('radio').nth(i).click()};const next=()=>p.getByRole('button',{name:/^Next/}).click();
for(let i=0;i<3;i++){await pick(easy[i].answer);await next()}await pick((easy[3].answer+1)%4);
// jump to Q17
if(w===390){await p.getByRole('button',{name:'Questions'}).click();}await p.getByRole('button',{name:'Question 17',exact:false}).first().click();await p.getByText(/QUESTION 17 OF 25/).waitFor();
await p.locator('img.learn-figure').waitFor();await p.waitForTimeout(300);
const nat=await p.locator('img.learn-figure').evaluate(i=>({nw:i.naturalWidth,w:i.clientWidth,complete:i.complete}));console.log(w,'figure',JSON.stringify(nat));
await p.screenshot({path:`/downloads/c1-figure-q17-${w}.png`});
const tm=async()=>{const t=await p.locator('[role=timer]').innerText();const [m,sec]=t.split(':').map(Number);return m*60+sec};
const t0=await tm();await p.getByRole('button',{name:'Enlarge figure'}).click();const dlg=p.getByRole('dialog',{name:'Enlarged figure'});await dlg.waitFor();
const z=await dlg.evaluate(d=>{const b=d.querySelector('.learn-zoom-body'),i=d.querySelector('img');return {imgW:i.clientWidth,scrollW:b.scrollWidth,boxW:b.clientWidth,focus:document.activeElement.textContent}});console.log(w,'zoom',JSON.stringify(z));
const sc=await dlg.evaluate(d=>{const b=d.querySelector('.learn-zoom-body');b.scrollLeft=b.scrollWidth;b.scrollTop=b.scrollHeight;return {x:b.scrollLeft,y:b.scrollTop,canX:b.scrollWidth>b.clientWidth,canY:b.scrollHeight>b.clientHeight,imgH:d.querySelector('img').clientHeight,boxH:b.clientHeight}});console.log(w,'pan',JSON.stringify(sc));await dlg.evaluate(d=>{const b=d.querySelector('.learn-zoom-body');b.scrollLeft=0;b.scrollTop=0});await p.screenshot({path:`/downloads/c2-zoom-${w}.png`});await p.waitForTimeout(3200);
await p.keyboard.press('Escape');await p.waitForTimeout(200);const t1=await tm();
console.log(w,'after Escape: dialog',await dlg.count(),'focus',await p.evaluate(()=>document.activeElement.getAttribute('aria-label')),'timer dropped',t0-t1,'s');
await p.getByRole('button',{name:'Enlarge figure'}).click();await p.getByRole('button',{name:'Close'}).click();await p.waitForTimeout(150);console.log(w,'Close button: dialog',await dlg.count(),'focus',await p.evaluate(()=>document.activeElement.getAttribute('aria-label')));
await p.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});await p.waitForTimeout(2200);await p.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});const t2=await tm();console.log(w,'timer after simulated background 2s: dropped',t1-t2);

await pick((easy[16].answer+1)%4);
await p.getByRole('button',{name:'Submit practice'}).click();await p.getByRole('button',{name:/Submit|Finish|Yes/}).last().click();await p.getByText(/correct ·/).first().waitFor();
const txt=await p.locator('main').innerText();console.log(w,'result',JSON.stringify(txt.match(/\d+ correct[^\n]*|-?[\d.]+\s*\/\s*[\d.]+/g)));
const art=p.locator('article.learn-review-item',{hasText:'17.'}).first();await art.scrollIntoViewIfNeeded();await art.screenshot({path:`/downloads/c1-review-q17-${w}.png`});
await c.close()}
}finally{if(b)await b.close();if(vite)await vite.close();if(api)await new Promise(r=>api.close(r));await mongoose.disconnect();await mongo.stop()}
