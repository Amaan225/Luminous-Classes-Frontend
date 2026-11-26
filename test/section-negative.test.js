import {test} from 'node:test';import assert from 'node:assert/strict';
import {quizScore,markText} from '../src/learner-content.js';
const qs=[];['Session I','Session I','Session II','Session II'].forEach((s,i)=>qs.push({id:'q:'+i,text:'t',options:['a','b','c','d'],answer:0,section:s}));
const quiz={marks:3,negativeMarks:1,sectionNegativeMarks:[0,1],questions:qs};
test('per-session negative marking',()=>{
 let r=quizScore(quiz,{'q:0':1,'q:1':0,'q:2':1,'q:3':0});assert.equal(r.score,3+3-1);assert.equal(r.incorrect,2);
 r=quizScore(quiz,{'q:0':1});assert.equal(r.score,0);
 r=quizScore(quiz,{'q:2':1});assert.equal(r.score,-1);
 r=quizScore(quiz,{'q:0':1,'q:1':1},qs.slice(0,2));assert.equal(r.score,0);});
test('uniform quizzes unchanged',()=>{assert.equal(quizScore({marks:2,negativeMarks:0.5,questions:qs},{'q:0':1,'q:1':0}).score,1.5)});
test('mark text',()=>{assert.equal(markText(quiz),'+3 correct · Session I: no negative · Session II: -1 wrong');assert.equal(markText({marks:1,negativeMarks:0}),'+1 correct · No negative marks');assert.match(markText({marks:3,negativeMarks:1,sectionNegativeMarks:[0,1]}),/Session 2: -1 wrong/)});
