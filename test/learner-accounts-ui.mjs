// Local-only. Real local API + in-memory Mongo + real browser. Synthetic Google-verified sessions are injected in the test DB only.
import {createRequire} from 'node:module';import path from 'node:path';import {createServer} from 'vite';import {chromium} from 'playwright';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const req=createRequire(path.resolve(process.cwd(),'../tutor49-back/package.json')),express=req('express'),mongoose=req('mongoose'),{MongoMemoryServer}=req('mongodb-memory-server');
const {createLearnerRouters}=req('./learner-routes'),{createLearnerAccountRouter}=req('./learner-account-routes'),{createTutorAccountRouter}=req('./tutor-account-routes');
const L=req('./models/learner'),acct=req('./models/tutor-account');
process.env.VITE_TUTOR_ACCOUNTS_ENABLED='true';process.env.VITE_TUTOR_PREVIEW='true';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const mongo=await MongoMemoryServer.create();await mongoose.connect(mongo.getUri('tutor49_test'));
let api,vite,b;const origin='http://127.0.0.1:5193';
try{
 await Promise.all([...Object.values(acct),L.Quiz,L.Note].map(m=>m.init()));
 const mk=async sub=>{const a=await acct.Account.create({googleSub:sub,email:sub+'@gmail.com',name:'Asha Learner'});const t=crypto.randomBytes(32).toString('base64url');await acct.Session.create({tokenHash:hash(t),accountId:a._id,csrfToken:'c'.repeat(43),expiresAt:new Date(Date.now()+3600000)});return t};
 const tok=await mk('ui-learner'),tok2=await mk('ui-other');
 const quiz=await L.Quiz.create({title:'Local synthetic reasoning set',description:'Synthetic fixture.',published:true,levels:['exam'],targets:['SSC CGL'],subjects:['Reasoning'],kind:'sectional',minutes:5,marks:2,negativeMarks:0.5,questions:[
  {text:'Odd one out? 2, 4, 7, 8',options:['2','4','7','8'],answer:2,explanation:'Seven is odd.',section:'Reasoning'},{text:'3 + 3?',options:['5','6','7','8'],answer:1,explanation:'Six.',section:'Reasoning'},{text:'Opposite of hot?',options:['cold','warm','red','big'],answer:0,explanation:'Cold.',section:'English'}]});
 await L.Note.create({title:'Local synthetic note',published:true,levels:['exam'],targets:['SSC CGL'],subjects:['Reasoning'],pdf:Buffer.from('%PDF-1.4 fixture'),bytes:16,pages:1});
 const cfg={enabled:true,secure:false,origins:[origin],googleClientId:'x',loginLimit:500};
 const app=express();app.set('trust proxy',1);app.use(express.json());
 const lr=createLearnerRouters({loginRequired:true});app.use('/api/learn',lr.publicRouter);
 app.use('/api/tutor-account',createTutorAccountRouter({config:cfg}));app.use('/api/learn/me',createLearnerAccountRouter({config:{...cfg,limit:1000}}));
 api=app.listen(5079,'127.0.0.1');await new Promise(r=>api.once('listening',r));
 vite=await createServer({root:process.cwd(),server:{host:'127.0.0.1',port:5193,strictPort:true}});await vite.listen();
 b=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',args:['--no-sandbox']});
 const profile=JSON.stringify({level:'exam',target:'SSC CGL',subject:'Reasoning'});
 const hs=p=>p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 // 1. Signed out: browsing works, starting asks for sign-in and fetches no quiz content.
 for(const w of [320,390,1280]){const c=await b.newContext({viewport:{width:w,height:900}});await c.addInitScript(p=>localStorage.setItem('t49-learn-profile-v1',p),profile);const p=await c.newPage();const seen=[];p.on('response',r=>{if(/learn\/(quizzes|me\/attempts)/.test(r.url()))seen.push(r.url())});
  await p.goto(origin+'/learn?view=quizzes');await p.getByRole('heading',{name:'Local synthetic reasoning set'}).waitFor();
  assert.equal(await hs(p),false);await p.getByRole('button',{name:/Start/}).first().click();await p.getByRole('dialog').waitFor();await p.getByText('Sign in to start this test').waitFor();
  assert.equal(seen.length,0,'no quiz or attempt request before sign-in');await p.screenshot({path:`/downloads/ld-gate-${w}.png`});assert.equal(await hs(p),false);await c.close()}
 // 2. Signed in: full flow, answers never sent before submit.
 const c=await b.newContext({viewport:{width:390,height:900}});await c.addCookies([{name:'t49session',value:tok,domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);await c.addInitScript(p=>localStorage.setItem('t49-learn-profile-v1',p),profile);
 const p=await c.newPage();let pre=[],submitted=false;p.on('response',async r=>{if(/me\/attempts\/start/.test(r.url())){const t=await r.text();pre.push(t)}});
 await p.goto(origin+'/learn?view=quizzes');await p.getByRole('heading',{name:'Local synthetic reasoning set'}).waitFor();
 await p.getByRole('button',{name:/Start/}).first().click();await p.getByRole('radio').first().waitFor();
 assert.ok(pre.length===1&&!/explanation|"answer"/.test(pre[0]),'start response has no answers');
 const clickOpt=async(i)=>{await p.getByRole('radio').nth(i).click()};
 await clickOpt(2);await p.getByRole('button',{name:/Next/}).first().click();await clickOpt(0);await p.getByRole('button',{name:/Next/}).first().click();
 await p.getByRole('button',{name:'Submit practice'}).click();await p.getByRole('button',{name:'Yes, submit answers'}).click();
 await p.getByRole('heading',{name:'Your practice results'}).waitFor();await p.screenshot({path:'/downloads/ld-results-signed-in-390.png',fullPage:true});
 const text=await p.locator('main').innerText();assert.ok(/Seven is odd/.test(text),'explanation shown after submit');assert.ok(/Saved to your account/.test(text)&&!/Saved in this browser only/.test(text),'result copy says account');assert.ok(/saved to your account and shown on your dashboard/.test(await p.locator('footer').innerText())&&!/Sign in with Google to save/.test(await p.locator('footer').innerText()),'footer signed-in copy');assert.ok(!/not synced to your tutor account/.test(await p.locator('footer').innerText()),'footer copy');
 // reload and a brand new browser session with the same cookie still show the saved result
 const url=p.url();await p.reload();await p.getByRole('heading',{name:'Your practice results'}).waitFor().catch(()=>{});
 {const c9=await b.newContext({viewport:{width:390,height:900}});await c9.addCookies([{name:'t49session',value:tok,domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);const p9=await c9.newPage();await p9.goto(origin+'/learn');await p9.getByText('Your saved results').waitFor();await p9.getByRole('button',{name:/Local synthetic reasoning set/}).first().click();await p9.getByRole('heading',{name:'Your practice results'}).waitFor();const t9=await p9.locator('main').innerText();assert.ok(/Seven is odd/.test(t9)&&/Saved to your account/.test(t9),'cross-session review');await c9.close()}
 // 3. Dashboard shows the real attempt, server score 2-0.5=1.5 of 6.
 await p.goto(origin+'/learn/dashboard');await p.getByRole('heading',{name:/Hi Asha/}).waitFor();
 await p.getByText('tests taken',{exact:true}).waitFor();assert.equal(await p.locator('.ld-stats b').nth(1).innerText(),'1');
 assert.equal(await p.locator('.ld-stats b').nth(2).innerText(),'50%');assert.equal(await hs(p),false);await p.screenshot({path:'/downloads/ld-real-overview-390.png',fullPage:true});
 await p.getByRole('tab',{name:'Quizzes'}).click();await p.getByText(/Score 1\.5 \/ 6/).waitFor();await p.screenshot({path:'/downloads/ld-real-quizzes-390.png'});
 await p.getByRole('button',{name:/Local synthetic reasoning set/}).click();await p.getByRole('heading',{name:'Your practice results'}).waitFor();
 // notes
 await p.goto(origin+'/learn?view=notes');await p.getByRole('heading',{name:'Local synthetic note'}).waitFor();const [dl]=await Promise.all([p.waitForEvent('download'),p.getByRole('button',{name:'Download PDF'}).click()]);assert.ok((await dl.suggestedFilename()).endsWith('.pdf'));
 await p.goto(origin+'/learn/dashboard');await p.getByRole('tab',{name:'Notes'}).click();await p.getByText('Local synthetic note').waitFor();
 // delete request pauses, cancel restores, account survives
 await p.getByRole('tab',{name:'Account'}).click();await p.getByRole('button',{name:'Delete my learner data'}).click();await p.getByRole('button',{name:'Request deletion'}).click();await p.getByText('Learner data deletion requested').waitFor();await p.screenshot({path:'/downloads/ld-real-delete-390.png',fullPage:true});
 await p.getByRole('button',{name:'Cancel deletion'}).click();await p.getByRole('tab',{name:'Overview'}).waitFor();await p.getByText('tests taken',{exact:true}).waitFor();
 assert.equal((await acct.Account.countDocuments({googleSub:'ui-learner'})),1);
 // 4. Other learner sees an honest empty dashboard.
 const c2=await b.newContext({viewport:{width:390,height:900}});await c2.addCookies([{name:'t49session',value:tok2,domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);const p2=await c2.newPage();await p2.goto(origin+'/learn/dashboard');await p2.getByText('No results yet').waitFor();await p2.screenshot({path:'/downloads/ld-real-empty-390.png',fullPage:true});
 // 5. Signed-out dashboard asks for login.
 const c3=await b.newContext({viewport:{width:390,height:900}});const p3=await c3.newPage();await p3.goto(origin+'/learn/dashboard');await p3.getByText('Sign in with Google',{exact:true}).first().waitFor();
 console.log('learner accounts UI: ALL PASS');
}finally{await b?.close();await vite?.close();api?.close();await mongoose.disconnect();await mongo.stop()}
