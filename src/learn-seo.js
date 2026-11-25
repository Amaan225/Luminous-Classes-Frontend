import {learnerTargets,learnerSubjects,WHOLE_EXAM,kindLabels,difficultyLabels} from './learner-content.js';
// Builds crawlable /learn/<exam>[/<subject>] routes from the PUBLISHED catalog only.
// A route exists only when it has at least one real published item. The catalog never carries questions or answers.
export const slugify=s=>String(s).toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const firstPara=t=>String(t||'').split(/\n\s*\n/)[0].trim();
const item=(x,type)=>({type,id:x.id,title:x.title,description:firstPara(x.description),kind:x.kind||'',difficulty:x.difficulty||'',questions:x.questionCount||0,minutes:x.minutes||0,pages:x.pages||0,subjects:x.subjects||[],updatedAt:x.updatedAt||''});
const examTargets=learnerTargets.exam.filter(t=>t!=='Other exam');
const examSubjects=learnerSubjects.exam.filter(s=>s!==WHOLE_EXAM);
export function profileLink(exam,subject){return '/learn?stage=exam&target='+encodeURIComponent(exam)+'&subject='+encodeURIComponent(subject||WHOLE_EXAM)+'&view=quizzes'}
export function buildLearnRoutes(catalog){
 const quizzes=(catalog?.quizzes||[]).filter(q=>q.published!==false&&q.levels?.includes('exam'));
 const notes=(catalog?.notes||[]).filter(n=>n.published!==false&&n.levels?.includes('exam'));
 const routes=[];
 for(const exam of examTargets){
  const qs=quizzes.filter(q=>q.targets?.includes(exam)),ns=notes.filter(n=>n.targets?.includes(exam));
  if(!qs.length&&!ns.length)continue;
  const base='/learn/'+slugify(exam);
  const mk=(path,subject,q,n)=>{const c=q.length,label=subject?exam+' '+subject:exam;const lead=c?c+' timed practice '+(c===1?'test':'tests'):n.length+' '+(n.length===1?'note':'notes');return {path,exam,subject:subject||'',title:label+' practice on Tutor49',description:lead+' for '+label+' on Tutor49. Self-practice with answers explained after you submit. Not an official exam.',items:[...q.map(x=>item(x,'quiz')),...n.map(x=>item(x,'note'))],updatedAt:[...q,...n].map(x=>x.updatedAt||'').sort().pop()||''}};
  routes.push(mk(base,'',qs,ns));
  for(const s of examSubjects){const q=qs.filter(x=>x.subjects?.includes(s)),n=ns.filter(x=>x.subjects?.includes(s));if(q.length||n.length)routes.push(mk(base+'/'+slugify(s),s,q,n))}
 }
 return routes;
}
export {kindLabels,difficultyLabels};
