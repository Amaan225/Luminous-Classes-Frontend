import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'vite';
const vite=await createServer({root:process.cwd(),server:{host:'127.0.0.1',port:5174,strictPort:true}});await vite.listen();
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',headless:true,args:['--no-sandbox']});
try{for(const width of [390,1280]){
const context=await browser.newContext({viewport:{width,height:844}});const page=await context.newPage();
await page.route('https://**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='luminous-classes-backend.onrender.com')return route.abort();if(u.pathname==='/api/admin/login')return route.fulfill({json:{token:'synthetic-admin-session',expiresAt:Date.now()+3600000}});return route.fulfill({json:[]});});
await page.goto('http://127.0.0.1:5174/admin');await page.locator('input[type=password]').fill('synthetic-test-only');await page.locator('form button[type=submit]').click();
const ledger=page.getByRole('button',{name:/Active Ledger/});await ledger.waitFor();await page.getByRole('heading',{name:/Active Job Ledger/}).waitFor();assert.equal(await ledger.getAttribute('aria-current'),'page');
await page.getByRole('button',{name:/Pending Leads/}).click();assert.equal(await page.getByRole('button',{name:/Pending Leads/}).getAttribute('aria-current'),'page');
await page.reload();await page.locator('input[type=password]').fill('synthetic-test-only');await page.locator('form button[type=submit]').click();await ledger.waitFor();await page.getByRole('heading',{name:/Active Job Ledger/}).waitFor();assert.equal(await ledger.getAttribute('aria-current'),'page');
await page.screenshot({path:'/downloads/t49-admin-default-'+width+'.png',fullPage:true});await context.close();
}console.log('Default Active Ledger after login and reload passes at390/1280. All external calls blocked or fixtures.');}finally{await browser.close();await vite.close();}
