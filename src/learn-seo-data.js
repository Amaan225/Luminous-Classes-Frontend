let serverData=null;
export function setLearnSeoData(d){serverData=d}
export function getLearnSeoData(){
 if(typeof document==='undefined')return serverData;
 try{return JSON.parse(document.getElementById('learn-seo-data')?.textContent||'null')}catch{return null}
}
