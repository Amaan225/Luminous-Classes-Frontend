// Local-only visual test. Synthetic identities/sessions are injected into a loopback test DB.
// This never simulates Google success in the shipped app and cannot reach production data/payments.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {chromium} from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const req=createRequire(path.resolve(root,'../backend/package.json'));
const express=req('express'),mongoose=req('mongoose');
const {MongoMemoryServer}=req('mongodb-memory-server');
const {createTutorAccountRouter,hash}=req('./tutor-account-routes');
const models=req('./models/tutor-account'),Tutor=req('./models/tutor'),Job=req('./models/jobmodel');
const out='/downloads/t49-phase1/visual-owner-test';await fs.mkdir(out,{recursive:true});
process.env.VITE_TUTOR_ACCOUNTS_ENABLED='true';process.env.VITE_TUTOR_PREVIEW='true';
const db=await MongoMemoryServer.create();await mongoose.connect(db.getUri('tutor49_test'));
let api,vite,browser;const tokens={};
try{
 await Promise.all(Object.values(models).map(m=>m.init()));await Tutor.init();
 const makeJob=(subject,grade,area,salary,status='approved')=>Job.create({parentName:'Synthetic parent',contactNumber:'0000000000',subject,grade,city:'Lucknow',location:area,salary,status,leadType:'direct',requirements:'Synthetic test requirement. Not a real tuition lead.'});
 const math=await makeJob('Mathematics','8','Aliganj',6500),science=await makeJob('Science','10','Gomti Nagar',8000),english=await makeJob('English','6','Indira Nagar',4500),hidden=await makeJob('All subjects','5','Test area',3500,'hidden');
 for(const role of ['approved','pending','unpaid','new','legacy']){
  let t;if(!['new','legacy'].includes(role))t=await Tutor.create({name:'Demo tutor',email:role+'@example.invalid',phone:({'approved':'0000000001','pending':'0000000002','unpaid':'0000000003'})[role],collegeId:'Synthetic test reference',city:'Lucknow',preferredArea:'Aliganj',status:role==='approved'?'approved':'pending',isPaid:role!=='unpaid'});
  const a=await models.Account.create({googleSub:'local-fixture-'+role,email:role+'@example.invalid',name:'Demo tutor',tutorId:t?._id||null,legacyReview:role==='legacy'});
  const token=crypto.randomBytes(32).toString('base64url');tokens[role]=token;await models.Session.create({tokenHash:hash(token),accountId:a._id,csrfToken:crypto.randomBytes(32).toString('hex'),expiresAt:new Date(Date.now()+3600000)});
  if(role==='approved')for(const j of [math,hidden])await models.Order.create({accountId:a._id,tutorId:t._id,kind:'lead',jobId:j._id,resource:String(j._id),status:'verified',providerOrderId:'order_fixture'+j._id,paymentId:'pay_fixture'+j._id,verifiedAt:new Date('2026-11-17T10:00:00Z')});
 }
 const app=express();app.use(express.json());app.use('/api/tutor-test',createTutorAccountRouter({models,Tutor,Job,config:{enabled:true,live:false,secure:false,cookieNamespace:'t49test',alertsEnabled:false,origins:['http://127.0.0.1:5173'],pendingPolicy:'masked',retentionPolicy:'retain-purchased'}}));
 api=app.listen(5079,'127.0.0.1');await new Promise(r=>api.once('listening',r));
 const {createServer}=await import('vite');vite=await createServer({root,server:{host:'127.0.0.1',port:5173,strictPort:true}});await vite.listen();
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const checks=[];
 for(const width of [320,390,1280]){
  const context=await browser.newContext({viewport:{width,height:900}});await context.addCookies([{name:'t49testsession',value:tokens.approved,domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);
  const p=await context.newPage();await p.goto('http://127.0.0.1:5173/tutor-test');await p.getByRole('heading',{name:'Welcome, Demo tutor.'}).waitFor();await p.getByRole('heading',{name:'Science',exact:true}).waitFor();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await p.locator('script[src*="googletagmanager"]').count(),0);assert.equal(await p.locator('script[src*="checkout.razorpay"]').count(),0);
  assert.equal(await p.getByText('0000000000',{exact:false}).count(),0);
  await p.screenshot({path:`${out}/available-${width}.png`,fullPage:true});
  const unlock=p.getByRole('button',{name:'Unlock · ₹49',exact:true}).first();await unlock.click();await p.getByRole('dialog').waitFor();assert.ok((await p.getByRole('dialog').innerText()).includes('₹49'));await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});await unlock.click();await p.getByRole('dialog').waitFor();await p.keyboard.press('Tab');await p.keyboard.press('Tab');assert.equal(await p.getByRole('button',{name:'Cancel',exact:true}).evaluate(el=>document.activeElement===el),true);await p.getByRole('button',{name:'Cancel',exact:true}).click();
  await p.getByRole('button',{name:'My Unlocked Leads',exact:true}).click();await p.getByRole('button',{name:'Show purchased contact',exact:true}).first().waitFor();assert.equal(await p.getByRole('button',{name:'Show purchased contact',exact:true}).count(),2);
  await p.screenshot({path:`${out}/history-${width}.png`,fullPage:true});
  await p.getByRole('button',{name:'Show purchased contact',exact:true}).first().click();await p.getByRole('link',{name:'+91 0000000000',exact:true}).waitFor();
  await p.getByRole('button',{name:'Available Leads',exact:true}).click();await p.getByRole('textbox',{name:'Search subject, class or area'}).fill('Science');await p.getByRole('button',{name:'Search leads',exact:true}).click();await p.getByRole('heading',{name:'Science',exact:true}).waitFor();
  assert.equal(await p.getByRole('heading',{name:'English',exact:true}).count(),0);
  checks.push({width,overflow:false,privateContactInitiallyHidden:true,historyOwnOnly:true,modalPrice49:true,search:true});await context.close();
 }
 for(const role of ['pending','new','legacy','unpaid']){
  const context=await browser.newContext({viewport:{width:390,height:844}});await context.addCookies([{name:'t49testsession',value:tokens[role],domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);const p=await context.newPage();await p.goto('http://127.0.0.1:5173/tutor-test');await p.getByRole('heading',{name:'Welcome, Demo tutor.'}).waitFor();
  if(role==='pending'){await p.getByRole('heading',{name:'Your application is in review'}).waitFor();await p.getByRole('heading',{name:'Science',exact:true}).waitFor();assert.equal(await p.getByRole('button',{name:'Unlock · ₹49',exact:true}).first().isDisabled(),true);assert.equal(await p.getByText('0000000000',{exact:false}).count(),0);}
  if(role==='new')await p.getByRole('heading',{name:'Complete your tutor profile'}).waitFor();
  if(role==='legacy')await p.getByRole('heading',{name:'Connect your existing registration'}).waitFor();
  if(role==='unpaid')await p.getByRole('heading',{name:'One-time registration · ₹49'}).waitFor();
  await p.screenshot({path:`${out}/${role}-390.png`,fullPage:true});await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844}});const p=await context.newPage();await p.goto('http://127.0.0.1:5173/tutor-test');await p.getByText('Google sign-in setup is still pending.',{exact:false}).waitFor();await p.screenshot({path:`${out}/signin-unconfigured-390.png`,fullPage:true});await context.close();
 assert.equal(await models.Order.countDocuments(),2,'UI modal alone must not create/payment order');
 // Owner-test Disable must never unsubscribe a live-origin browser subscription.
 const check=await browser.newContext({viewport:{width:390,height:844}});await check.addCookies([{name:'t49testsession',value:tokens.approved,domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);
 await check.addInitScript(()=>{Object.defineProperty(navigator,'serviceWorker',{value:{getRegistration:async()=>{window.__liveTouched=true;return null}}})});
 const page=await check.newPage();await page.goto('http://127.0.0.1:5173/tutor-test');await page.getByRole('heading',{name:'Welcome, Demo tutor.'}).waitFor();
 assert.equal(await page.getByRole('button',{name:'Enable alerts on this device',exact:true}).count(),0);
 await page.getByRole('button',{name:'Disable alerts on this device',exact:true}).click();await page.getByText('Your live device setting is unchanged.',{exact:false}).waitFor();assert.equal(await page.evaluate(()=>Boolean(window.__liveTouched)),false);
 assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex');await check.close();
 const report={checkedAt:new Date().toISOString(),syntheticLocalFixtures:true,noProductionRequests:true,googleEndToEndVerified:false,pushTransportDisabled:true,liveDeviceUntouched:true,checks};await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{if(browser)await browser.close();if(vite)await vite.close();if(api)await new Promise(r=>api.close(r));await mongoose.disconnect();await db.stop()}
