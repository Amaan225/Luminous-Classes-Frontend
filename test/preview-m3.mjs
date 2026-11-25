import {createServer} from 'vite';import {chromium} from 'playwright';
const mk=(id,title,kind,o={})=>({id,title,description:o.d||'PREVIEW MOCK DATA, not published.',levels:['exam'],targets:['SSC CGL'],subjects:o.s||[],topic:'',published:true,questionCount:o.n||25,minutes:o.m||15,marks:2,negativeMarks:0.5,kind,difficulty:o.diff||'',updatedAt:'2026-11-25'});
const full=[mk('a','Sample: SSC CGL Tier-I style mini mock (original demo)','sample',{n:20,m:12,d:'SAMPLE. Shortened original demo, not a real past paper and not a full exam.'}),mk('d','PREVIEW ONLY: Full Mock Test layout','full',{n:100,m:60}),mk('e','PREVIEW ONLY: Previous year paper layout','pyq',{n:100,m:60})];
const withSec=[...full,mk('b','PREVIEW ONLY: Reasoning Sectional Mock Test','sectional',{s:['Reasoning'],diff:'easy'})];
const vite=await createServer({root:process.cwd(),server:{host:'127.0.0.1',port:5193,strictPort:true}});await vite.listen();
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',args:['--no-sandbox']});
const out=(...a)=>console.log(...a);
for(const [w,h] of [[390,844],[1280,900]]){
// Journey A: no subject
let c=await b.newContext({viewport:{width:w,height:h}});let p=await c.newPage();
await p.route('**/api/learn/catalog',r=>r.fulfill({json:{notes:[],quizzes:withSec}}));
await p.goto('http://127.0.0.1:5193/learn');
await p.getByLabel('Learning stage').selectOption('exam');await p.getByLabel('Exam').selectOption('SSC CGL');await p.getByLabel('Subject').selectOption({label:'Whole exam (no subject)'});
await p.screenshot({path:`/downloads/m3-step1-whole-${w}.png`,fullPage:true});
await p.getByRole('button',{name:'Next'}).click();await p.waitForTimeout(300);
await p.screenshot({path:`/downloads/m3-dash-whole-${w}.png`,fullPage:true});
out(w,'notes card shown:',await p.getByRole('button',{name:/Relevant notes/}).count());
await p.getByRole('button',{name:/Quiz & practice/}).click();await p.waitForTimeout(300);
out(w,'A whole-exam list:',JSON.stringify((await p.locator('main').innerText()).match(/PREVIEW ONLY[^\n]*|Sample:[^\n]*/g)),'tabs:',await p.getByRole('tab').count());
await p.screenshot({path:`/downloads/m3-list-whole-${w}.png`,fullPage:true});out(w,'tags',await p.locator('.learn-tags').innerText());await c.close();
// Journey B: Reasoning, zero Reasoning tests
c=await b.newContext({viewport:{width:w,height:h}});p=await c.newPage();
await p.route('**/api/learn/catalog',r=>r.fulfill({json:{notes:[],quizzes:full}}));
await p.goto('http://127.0.0.1:5193/learn');
await p.getByLabel('Learning stage').selectOption('exam');await p.getByLabel('Exam').selectOption('SSC CGL');await p.getByLabel('Subject').selectOption('Reasoning');
await p.getByRole('button',{name:'Next'}).click();await p.getByRole('button',{name:/Quiz & practice/}).click();await p.getByRole('tab').first().waitFor();
const t=await p.locator('main').innerText();out(w,'B reasoning empty:',/No Reasoning tests yet/.test(t),'no exam items in subject tab:',!/PREVIEW ONLY|Sample:/.test(t));
await p.screenshot({path:`/downloads/m3-list-reasoning-empty-${w}.png`,fullPage:true});await c.close();
}
// Drawer: 100 questions, keyboard
const c=await b.newContext({viewport:{width:390,height:700}});const p=await c.newPage();
await p.route('**/api/learn/catalog',r=>r.fulfill({json:{notes:[],quizzes:full}}));
await p.route('**/api/learn/quizzes/*',r=>r.fulfill({json:{...full[1],questions:Array.from({length:100},(_,i)=>({id:'q'+i,section:'S',text:'PREVIEW question '+(i+1),options:['a','b','c','d'],answer:1,explanation:'x'}))}}));
await p.goto('http://127.0.0.1:5193/learn');
await p.getByLabel('Learning stage').selectOption('exam');await p.getByLabel('Exam').selectOption('SSC CGL');await p.getByLabel('Subject').selectOption({label:'Whole exam (no subject)'});
await p.getByRole('button',{name:'Next'}).click();await p.getByRole('button',{name:/Quiz & practice/}).click();
await p.getByRole('button',{name:/Start practice/}).nth(0).click();await p.getByText('PREVIEW question 1').first().waitFor();
// answer Q1 correct (b), mark it; Q2 wrong (a), mark; Q3 skip; submit
await p.getByRole('radio').nth(1).click();await p.getByRole('button',{name:/Mark for review/}).click();await p.getByRole('button',{name:/^Next/}).click();
await p.getByRole('radio').nth(0).click();await p.getByRole('button',{name:/Mark for review/}).click();
await p.getByRole('button',{name:'Questions'}).click();await p.waitForTimeout(300);
out('focus after open:',await p.evaluate(()=>document.activeElement.className));
out('drawer scrollable:',await p.locator('.learn-palette').evaluate(e=>({sh:e.scrollHeight,ch:e.clientHeight,oy:getComputedStyle(e).overflowY})));
await p.screenshot({path:'/downloads/m3-drawer-100-390.png'});
await p.keyboard.press('Escape');await p.waitForTimeout(300);
out('after Escape: vis',await p.locator('.learn-palette').evaluate(e=>getComputedStyle(e).visibility),'focus',await p.evaluate(()=>document.activeElement.className));
await p.getByRole('button',{name:'Submit practice'}).click();await p.getByRole('button',{name:/Submit now|Yes|Finish|Submit/}).last().click().catch(()=>{});
await p.waitForTimeout(500);out('result:',(await p.locator('main').innerText()).match(/\d+ correct[^\n]*|[-\d.]+\s*\/\s*[\d.]+/g));
await b.close();await vite.close();
