export const WHOLE_EXAM='Whole exam (no subject)';
export const learnerLevels = {school:'School',college:'College',exam:'Exam preparation',skills:'Skills & self-learning'};
export const learnerTargets = {school:['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'],college:['General foundation','Undergraduate'],exam:['SSC CGL','SSC CHSL','SSC MTS','SSC GD','RRB NTPC','UPSSSC PET','Bank PO','IBPS PO','UGC NET','CTET','Other exam'],skills:['Self-paced']};
export const learnerSubjects = {school:['Mathematics','Science','English','General Science','General Studies (GS)','Reasoning','Quantitative Aptitude'],college:['Quantitative Aptitude','Reasoning','English','General Science','General Studies (GS)'],exam:['Quantitative Aptitude','Mathematics','Reasoning','English','General Awareness','General Science','General Studies (GS)','Teaching and Research Aptitude','Child Development and Pedagogy','Environmental Studies',WHOLE_EXAM],skills:['Coding','Computer Basics']};
export const examLevelKinds=['full','pyq','sample'];
export const kindLabels={full:'Full mock test',sectional:'Sectional mock test',pyq:'Previous year paper',sample:'Sample mock (shortened)',practice:'Practice set'};
export const difficultyLabels={easy:'Easy',moderate:'Moderate',hard:'Hard'};
export function isExamLevel(item){return examLevelKinds.includes(item?.kind)}
export function matchesProfile(item,p){if(!item.levels.includes(p.level))return false;if(!(!item.targets?.length||item.targets.includes(p.target)))return false;return isExamLevel(item)||item.subjects.includes(p.subject);}
export function markText(q){const m=typeof q?.marks==='number'?q.marks:1,n=typeof q?.negativeMarks==='number'?q.negativeMarks:0;return '+'+m+' correct · '+(n?'-'+(Math.abs(n-1/3)<1e-9?'1/3':Math.round(n*100)/100)+' wrong':'No negative marks')}
export function fmt(n){return String(Math.round(n*100)/100)}
export function scoreAttempt(items,answers,marks=1,negative=0){const correct=items.filter(q=>answers[q.id]===q.answer).length;const answered=items.filter(q=>Number.isInteger(answers[q.id])&&answers[q.id]>=0&&answers[q.id]<q.options.length).length;return {correct,answered,incorrect:answered-correct,unanswered:items.length-answered,total:items.length,score:correct*marks-(answered-correct)*negative,max:items.length*marks};}
export function quizScore(quiz,answers,items=quiz.questions){return scoreAttempt(items,answers,typeof quiz.marks==='number'?quiz.marks:1,typeof quiz.negativeMarks==='number'?quiz.negativeMarks:0)}
