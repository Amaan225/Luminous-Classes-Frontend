import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'vite';
const vite=await createServer({root:process.cwd(),server:{host:'127.0.0.1',port:5174,strictPort:true}});await vite.listen();
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',headless:true,args:['--no-sandbox']});
try{for(const width of [390,1280]){
const posts=[];const context=await browser.newContext({viewport:{width,height:844}});const page=await context.newPage();
await page.route('https://**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='luminous-classes-backend.onrender.com')return route.abort();if(u.pathname==='/api/admin/login')return route.fulfill({json:{token:'synthetic-admin-session',expiresAt:Date.now()+3600000}});if(u.pathname==='/api/jobs'&&route.request().method()==='POST'){posts.push(route.request().postDataJSON());return route.fulfill({json:{ok:true}});}return route.fulfill({json:[]});});
page.on('dialog',dialog=>dialog.accept());await page.goto('http://127.0.0.1:5174/admin');await page.locator('input[type=password]').fill('synthetic-test-only');await page.locator('form button[type=submit]').click();
const ledger=page.getByRole('button',{name:/Active Ledger/});await ledger.waitFor();await page.getByRole('heading',{name:/Active Job Ledger/}).waitFor();assert.equal(await ledger.getAttribute('aria-current'),'page');
await page.getByRole('button',{name:/Pending Leads/}).click();assert.equal(await page.getByRole('button',{name:/Pending Leads/}).getAttribute('aria-current'),'page');
await page.reload();await page.locator('input[type=password]').fill('synthetic-test-only');await page.locator('form button[type=submit]').click();await ledger.waitFor();await page.getByRole('heading',{name:/Active Job Ledger/}).waitFor();assert.equal(await ledger.getAttribute('aria-current'),'page');
await page.getByRole('button',{name:'Inject Lead',exact:true}).click();const type=page.locator('select[name=leadType]');assert.equal(await type.inputValue(),'classic');
await type.selectOption('direct');assert.equal(await type.inputValue(),'direct');
for(const [name,value] of Object.entries({parentName:'Synthetic fixture',contactNumber:'0000000000',subject:'Maths',grade:'8',salary:'5000',location:'Fixture Area'}))await page.locator('input[name='+name+']').fill(value);
await page.getByRole('button',{name:'Inject Live Lead',exact:true}).click();await page.waitForFunction(()=>document.querySelector('select[name=leadType]')?.value==='classic');assert.equal(posts.length,1);assert.equal(posts[0].leadType,'direct');
await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'/downloads/t49-admin-classic-'+width+'.png',fullPage:true});
await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'/downloads/t49-admin-default-'+width+'.png',fullPage:true});await context.close();
}console.log('Default Active Ledger after login and reload passes at390/1280. All external calls blocked or fixtures.');}finally{await browser.close();await vite.close();}
