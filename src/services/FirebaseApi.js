function getListInbox(){

   return window.db.collection("inboxs").orderBy("update_time", 'desc')
}

function getMessage(uuid){
    return window.db.collection("inboxs").doc(uuid).collection("messages")
}

function listenMessage(uuid, event){
  return  window.db.collection("inboxs").doc(uuid).collection("messages")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                event("added", change.doc.data())
            }
            if (change.type === "modified") {
                event("modified", change.doc.data())
            }
            if (change.type === "removed") {
                event("removed", change.doc.data())
            }
        });
    });
}

function sendFirebaseMessage(uuid,message){
   return window.db.collection("inboxs").doc(uuid).collection("messages").add(message)
}
function adminUUID(){
    return "000-ad-mi-n00"
}
function createFirebaseInbox(uuid,info){
    return new Promise((re,rj)=>{
        window.db.collection("inboxs").doc(uuid).get() .then((doc) =>{
            if(!doc.exists) {
                window.db.collection("inboxs").doc(uuid).set({
                    avatar:info.avatar,
                    last_message:"",
                    unread:0,
                    update_time: (new Date()).getTime(),
                    name: info.fullname
                })
                window.db.collection("inboxs").doc(uuid).collection("messages")
                window.db.collection("inboxs").doc(uuid).get().then((doc)=>{
                    re({ id:doc.id, data:doc.data() } )
                })
            } else {
                window.db.collection("inboxs").doc(uuid).update({
                    avatar:info.avatar,
                    name:info.fullname
                }).then(()=>{
                    window.db.collection("inboxs").doc(uuid).get().then((doc)=>{
                        re({ id:doc.id, data:doc.data() } )
                    })
                })
               
            }
          });
    })
}

export  {
    getListInbox,
    listenMessage,
    getMessage,
    sendFirebaseMessage,
    adminUUID,
    createFirebaseInbox
}