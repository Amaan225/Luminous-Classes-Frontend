// No account, contact, token or subscription secrets are stored in notification payloads.
self.addEventListener('push',event=>{let data;try{data=event.data.json()}catch{return}
 const tag=typeof data.tag==='string'&&/^t49-lead-[a-f0-9]{24}$/.test(data.tag)?data.tag:'t49-new-lead';
 event.waitUntil(self.registration.showNotification('Tutor49',{body:'New lead in your area. Open your tutor dashboard.',tag,data:{url:'/tutor'}}));
});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of windows){if(new URL(client.url).origin===self.location.origin){await client.navigate('/tutor');return client.focus()}}return self.clients.openWindow('/tutor')})())});
