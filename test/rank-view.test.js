import {test} from 'node:test';import assert from 'node:assert/strict';
import {rankView} from '../src/lib/rankView.js';
test('valid rank shows ranked',()=>assert.equal(rankView({available:true,rank:2,participants:5,percentile:75}).kind,'ranked'));
test('cohort cap, error and missing snapshot show a visible unavailable note, never a rank',()=>{for(const reason of ['cohort-too-large','unavailable','no-snapshot'])assert.equal(rankView({available:false,reason}).kind,'unavailable')});
test('owner not-ranked and no-eligible-attempt stay quiet',()=>{for(const reason of ['not-ranked','no-eligible-attempt'])assert.equal(rankView({available:false,reason}).kind,'none');assert.equal(rankView(undefined).kind,'none')});
test('malformed or partial rank objects cannot look like a valid rank',()=>{for(const r of [{available:true},{available:true,rank:0,participants:3},{available:true,rank:4,participants:3},{available:true,rank:'2',participants:3},{available:true,rank:1,participants:null}])assert.equal(rankView(r).kind,'unavailable')});
