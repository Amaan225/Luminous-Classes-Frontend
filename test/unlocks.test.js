import { test } from 'node:test';
import assert from 'node:assert/strict';
import { approvedUnlocksForJob } from '../src/lib/unlocks.js';

test('counts only approved unlocks for the selected job, populated or plain IDs', () => {
  const records = [
    {_id:'1',jobId:{_id:'job-a'},status:'Approved'},
    {_id:'2',jobId:'job-a',status:'Approved'},
    {_id:'3',jobId:{_id:'job-b'},status:'Approved'},
    {_id:'4',jobId:'job-a',status:'Pending'},
    {_id:'5',jobId:'job-a',status:'Rejected'},
    {_id:'6',jobId:null,status:'Approved'},
    {_id:'7',status:'Approved'},
  ];
  assert.deepEqual(approvedUnlocksForJob(records,'job-a').map(r=>r._id),['1','2']);
  assert.deepEqual(approvedUnlocksForJob(records,'no-unlocks'),[]);
  assert.deepEqual(approvedUnlocksForJob([],'job-a'),[]);
});
