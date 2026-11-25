// PRIVATE local proof: fixtures only (/tmp/fixture-catalog.json). Nothing is published or indexed by this test.
import {execSync} from 'node:child_process';import fs from 'node:fs';import http from 'node:http';import path from 'node:path';import assert from 'node:assert/strict';import {chromium} from 'playwright';
const FIX=process.env.FIX||'/tmp/fixture-catalog.json',cat=JSON.parse(fs.readFileSync(FIX,'utf8'));
const build=f=>execSync('npm run build',{env:{...process.env,LEARN_CATALOG_FILE:f},stdio:'pipe'}).toString();
const read=p=>fs.readFileSync('dist'+p,'utf8');
// A. empty catalog: no extra routes, sitemap unchanged, /learn has no exam links
build('/tmp/empty-catalog.json');
assert.ok(!fs.existsSync('dist/learn/ssc-cgl'),'no empty category page');assert.equal((read('/sitemap.xml').match(/<loc>/g)||[]).length,6);assert.ok(!read('/learn/index.html').includes('Practice by exam'));console.log('A empty catalog: 0 extra routes, sitemap still 6 URLs, no exam links');
// B. fixture catalog
build(FIX);
const routes=['/learn/ssc-cgl','/learn/ssc-cgl/reasoning'];
for(const r of routes){const h=read(r+'/index.html');assert.equal((h.match(/rel="canonical"/g)||[]).length,1);assert.ok(h.includes(`href="https://www.tutor49.in${r}"`));assert.match(h,/<h1[\s>]/);assert.ok(!h.includes('content="noindex"'));assert.match(h,/<title>[^<]+<\/title>/);assert.ok(h.includes('id="learn-seo-data"'));
 for(const leak of ['"answer"','explanation','"questions":[','correctIndex'])assert.ok(!h.includes(leak),r+' leaks '+leak)}
const ex=read('/learn/ssc-cgl/index.html'),re_=read('/learn/ssc-cgl/reasoning/index.html');
for(const q of cat.quizzes.filter(q=>q.targets.includes('SSC CGL')))assert.ok(ex.includes(q.title.replace(/&/g,'&amp;')),'exam page lists '+q.title);
assert.ok(!ex.includes('Class 8 fractions')&&!re_.includes('Class 8 fractions'));assert.ok(!re_.replace(/<script[\s\S]*?<\/script>/g,'').includes('mini sample'),'subject page visibly lists only its subject');
assert.ok(ex.includes('href="/learn/ssc-cgl/reasoning"'),'exam links to subject');assert.ok(read('/learn/index.html').includes('href="/learn/ssc-cgl"'),'/learn links to exam');
assert.ok(!fs.existsSync('dist/learn/ssc-chsl')&&!fs.existsSync('dist/learn/ssc-cgl/quantitative-aptitude')&&!fs.existsSync('dist/learn/school'),'no routes for empty categories');
const sm=read('/sitemap.xml');assert.ok(routes.every(r=>sm.includes('https://www.tutor49.in'+r))&&!sm.includes('chsl')&&!sm.includes('quantitative'));
console.log('B fixture catalog: routes',routes.join(', '),'| titles/canonical/h1/list/links in initial HTML, no answer keys, sitemap lists only populated routes');
fs.writeFileSync('/tmp/seo-initial-reasoning.html',re_);
// C. browser: serve dist with the same rewrites as vercel.json; 404 for unknown
const srv=http.createServer((q,s)=>{const u=new URL(q.url,'http://x');if(u.pathname.startsWith('/api/learn/catalog')){s.setHeader('content-type','application/json');return s.end(JSON.stringify(cat))}if(u.pathname.startsWith('/api/'))return s.writeHead(404).end();let f='dist'+u.pathname;if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){return s.writeHead(404,{'content-type':'text/html'}).end(fs.readFileSync('dist/404.html'))}const t={html:'text/html',js:'text/javascript',css:'text/css',png:'image/png',svg:'image/svg+xml'}[f.split('.').pop()]||'application/octet-stream';s.setHeader('content-type',t);s.end(fs.readFileSync(f))}).listen(5197);
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',args:['--no-sandbox']});
try{
 const nojs=await b.newContext({javaScriptEnabled:false});const np=await nojs.newPage();await np.goto('http://127.0.0.1:5197/learn/ssc-cgl/reasoning');assert.ok(await np.getByRole('heading',{level:1}).innerText().then(t=>/SSC CGL Reasoning practice/.test(t)));assert.equal(await np.locator('article').count(),3);console.log('C1 JS disabled: h1 + 3 test cards visible');
 assert.equal((await np.goto('http://127.0.0.1:5197/learn/ssc-chsl')).status(),404);console.log('C2 /learn/ssc-chsl (no items) -> 404');
 for(const w of [320,390,1280]){const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];p.on('console',m=>{if(m.type()==='error'||/hydrat/i.test(m.text()))errs.push(m.text())});p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://127.0.0.1:5197/learn/ssc-cgl/reasoning');await p.getByRole('heading',{level:1}).waitFor();await p.waitForTimeout(500);assert.deepEqual(errs.filter(e=>!/Failed to load resource/.test(e)),[],'no hydration/console errors @'+w);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no horizontal scroll @'+w);
  await p.screenshot({path:`/downloads/t49-learn-seo-reasoning-${w}.png`,fullPage:w===390});
  if(w===390){await p.getByRole('link',{name:'Open these tests'}).click();await p.waitForURL(/\/learn\?stage=exam/);await p.getByRole('heading',{name:/Reasoning tests/}).waitFor().catch(()=>{});const body=await p.locator('main').innerText();assert.ok(/Reasoning/.test(body)&&/Sectional mock test/.test(body),'CTA lands in portal quiz list for Reasoning');assert.ok(!/No Reasoning tests yet/.test(body));await p.screenshot({path:'/downloads/t49-learn-seo-cta-390.png'});console.log('C3 CTA -> portal quizzes list for SSC CGL Reasoning')}
  await p.close()}
 console.log('C4 hydration clean, no horizontal scroll at 320/390/1280');
}finally{await b.close();srv.close()}
