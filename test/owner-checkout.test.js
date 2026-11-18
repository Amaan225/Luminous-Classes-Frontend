import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('owner checkout uses only synthetic prefill and rejects live keys',()=>{
const source=readFileSync(new URL('../src/pages/TutorAccount.jsx',import.meta.url),'utf8');
assert.ok(source.includes("prefill:ownerTest?{name:'Tutor49 test',email:'test@example.com',contact:'9000090000'}:"));
assert.ok(source.includes("if(ownerTest&&!String(order.keyId).startsWith('rzp_test_'))throw"));
});
