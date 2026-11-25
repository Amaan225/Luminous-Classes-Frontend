// Decides what the results screen shows for a rank object. A valid rank needs a real integer rank within the cohort.
// Cap or error reasons show a short unavailable note instead of silence, and never look like a valid partial rank.
const VISIBLE_UNAVAILABLE=new Set(['cohort-too-large','unavailable','no-snapshot']);
export function rankView(rank){
 if(!rank||typeof rank!=='object')return {kind:'none'};
 if(rank.available===true){
  const ok=Number.isInteger(rank.rank)&&Number.isInteger(rank.participants)&&rank.participants>=1&&rank.rank>=1&&rank.rank<=rank.participants;
  return ok?{kind:'ranked'}:{kind:'unavailable'};
 }
 if(rank.available===false&&VISIBLE_UNAVAILABLE.has(rank.reason))return {kind:'unavailable'};
 return {kind:'none'};
}
