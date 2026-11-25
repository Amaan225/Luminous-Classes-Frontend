import {createServer} from 'vite';import {chromium} from 'playwright';import fs from 'node:fs';
const mk=(id,title,kind,o={})=>({id,title,description:o.d||'PREVIEW MOCK DATA, not published.',levels:['exam'],targets:['SSC CGL'],subjects:o.s||[],topic:'',published:true,questionCount:o.n||25,minutes:o.m||15,marks:2,negativeMarks:0.5,kind,difficulty:o.diff||'',updatedAt:'2026-11-25'});
const quizzes=[
mk('a','Sample: SSC CGL Tier-I style mini mock (original demo)','sample',{n:20,m:12,d:'SAMPLE. Shortened original demo for practising the format, not a real past paper and not a full exam. 20 questions, 12 minutes, +2 for a correct answer, -0.5 for a wrong answer, 0 if skipped. The question count, timing and marking are for this demo only and are not the current official pattern, so check the official SSC notice for the exam you are preparing for.'}),
mk('b','PREVIEW ONLY: Reasoning Sectional Mock Test','sectional',{s:['Reasoning'],diff:'easy'}),
mk('c','PREVIEW ONLY: Quantitative Aptitude Sectional Mock Test','sectional',{s:['Quantitative Aptitude'],diff:'hard'}),
mk('d','PREVIEW ONLY: Full Mock Test layout','full',{n:100,m:60}),
mk('e','PREVIEW ONLY: Previous year paper layout','pyq',{n:100,m:60})];
const vite=await createServer({root:process.cwd(),server:{host:'127.0.0.1',port:5192,strictPort:true}});await vite.listen();
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',args:['--no-sandbox']});
for(const [w,h] of [[390,844],[1280,900]]){
const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();
await p.route('**/api/learn/catalog',r=>r.fulfill({json:{notes:[],quizzes}}));
await p.route('**/api/learn/quizzes/*',r=>r.fulfill({json:{...quizzes[1],questions:Array.from({length:25},(_,i)=>({id:'q'+i,section:'Reasoning',text:'PREVIEW question '+(i+1)+': which option completes the series? 2, 4, 8, 16, ?',options:['18','24','32','64'],answer:2,explanation:'x'}))}}));
await p.goto('http://127.0.0.1:5192/learn');
await p.getByLabel('Learning stage').selectOption('exam');await p.getByLabel('Exam').selectOption('SSC CGL');await p.getByLabel('Subject').selectOption('Reasoning');
await p.getByRole('button',{name:'Next'}).click();await p.getByRole('button',{name:/Quiz & practice/}).click();await p.getByRole('tab').first().waitFor();
const mainTxt=async()=>(await p.locator('main').innerText()).match(/PREVIEW ONLY[^\n]*|Sample:[^\n]*/g);
console.log(w,'subject tab',JSON.stringify(await mainTxt()));
await p.screenshot({path:`/downloads/m2-list-subject-${w}.png`,fullPage:true});
await p.getByRole('tab').nth(1).click();console.log(w,'exam tab',JSON.stringify(await mainTxt()));
await p.screenshot({path:`/downloads/m2-list-exam-${w}.png`,fullPage:true});
await p.getByRole('tab').first().click();
await p.getByRole('button',{name:/Start practice/}).first().click();await p.getByText('PREVIEW question 1:').first().waitFor();
const ans=async()=>{await p.getByRole('radio').nth(2).click()};const mark=()=>p.getByRole('button',{name:/Mark for review/}).click();const nxt=()=>p.getByRole('button',{name:/^Next/}).click();
await ans();await nxt();await ans();await mark();await nxt();await mark();await nxt();await nxt();
await p.reload();await p.waitForTimeout(500);await p.getByText('PREVIEW question 5:').first().waitFor();
await p.screenshot({path:`/downloads/m2-test-${w}.png`});
if(w<800){await p.getByRole('button',{name:'Questions'}).click();await p.waitForTimeout(400);await p.screenshot({path:`/downloads/m2-test-drawer-${w}.png`});console.log('labels',JSON.stringify(await p.locator('.learn-numbers button').evaluateAll(b=>b.slice(0,6).map(x=>x.getAttribute('aria-label')))));await p.getByRole('button',{name:'Question 20'}).click();await p.getByText('PREVIEW question 20:').first().waitFor();console.log('jump ok, drawer hidden:',await p.locator('.learn-palette').evaluate(e=>getComputedStyle(e).visibility))}
await c.close()}
await b.close();await vite.close();
