
import React,{useEffect, useState,useRef} from 'react'; 
import styles from "./styles.css"
import AdminLTE, { Inputs, Content, Row, Col, Box, Button,Badge  } from 'adminlte-2-react';
import {requestUserInfo,displayTime} from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";
import {baseurl} from "../config"

import {getListInbox,listenMessage,getMessage,sendFirebaseMessage,adminUUID,createFirebaseInbox} from "../../services/FirebaseApi"
const { Select, DateRange, DateTime, Text } = Inputs;
var messages = {}
var currentInboxListener
function displayStatus(slug, status){
  var statusStr =  slug;
  var color ="black"
  if (status == 2){
    color="red"
  } else  if (status == 1){
    color="green"
  } else  if (status == 3){
    color="yellow"
  }

return <Badge color={color} text={statusStr}></Badge>
}

function QuanLyData(props) {
  var categories = [];
  var [datasource,setDatasource] = useState([])
  
  var [listenerMessage,setListenerMessage] = useState(null)
  var options = [{text:"Tất cả",value:-1}];
  var [currentInbox,setCurrentInbox] =  useState(null)
  var [textMessage,setTextMessage] =  useState("")
  var status = []
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const messagesEndRef = useRef()

  const [filterOption,setExFilterOption] = useState({
    limit:20,
    page:1, 
    status:-1,
    totalItem: 0
  }) 
 
  useEffect(()=>{
    getListInbox().onSnapshot((querySnapshot) => {
      var result = [] 
      querySnapshot.forEach((doc)=>(result.push({ id:doc.id, data:doc.data() }))) 
      setDatasource(result)
    });
    var id = props.match.params.id;
    
    if (id != null){
    
      requestUserInfo(id).then((data)=>{
        createFirebaseInbox(id,data).then((data2)=>{
          setCurrentInbox(data2)
          choiceInbox(data2)
        })
      })
    }

  
 

  },[])
   
  function normalMessage(msg){
      if (msg == null || msg=="")
      return

      msg = msg.replace(/\t+/g," ").replace(/\n+/g," ")
      if (msg.length > 10){
        msg = msg.substring(0,10) + "..."
      }
       return msg
  }
  function chatRightItem(data){
      return (
        <div class="msg right-msg" key= {data.id}>
       
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">{data.user.name} </div>
            <div class="msg-info-time"> { displayTime(data.createdAt)}</div>
          </div>

          <div class="msg-text">
          {data.text}
          </div>
        </div>
      </div>
      )
  }
  function chatLeftItem(data){
     
    return (
      <div class="msg left-msg" key= {data.id}>
        
        <div class="msg-bubble">
          <div class="msg-info">
          <div class="msg-info-name">{data.user.name}</div>
            <div class="msg-info-time"> {displayTime(data.createdAt)}</div>
          </div>

          <div class="msg-text">
          {data.text}
          </div>
        </div>
      </div>
    )
  }
  function chatItem(data){
     var user = data.data.user
      if (user["_id"]==adminUUID()|| user["uuid"]==adminUUID()){
     return   chatRightItem(data.data)
      }else {
      return  chatLeftItem(data.data)
      }
  }
  function displayMessages(){
    var display = [];
    for (var x in messages){
      var msg = messages[x];
      if (msg.data == null){
        continue
      }
      display.push(chatItem(msg) )
    }
    return display
  }
  function displayBoxChat(){

    if (currentInbox == null){
      return
    }
    function _handleKeyDown(e){
      if (e.key === 'Enter') {
        sendMessage()
      }
    }
    return (  <section class="msger">
    <header class="msger-header">
      <div class="msger-header-title">
        <i class="fas fa-comment-alt"></i>  {currentInbox && currentInbox.data && currentInbox.data.name}
      </div>
      <div class="msger-header-options">
        <span><i class="fas fa-cog"></i></span>
      </div>
    </header>

    <div class="msger-chat" ref={messagesEndRef} >
      { 
        displayMessages()
      }
   
     
    </div>

    <div class="msger-inputarea">
      <input  onKeyDown={_handleKeyDown} type="text" class="msger-input" placeholder="Enter your message..." value={textMessage} onChange={(e)=>setTextMessage(e.target.value)}/>
      <button type="button" onClick = {()=>{sendMessage()}} class="msger-send-btn">Send</button>
    </div>
  </section>)
  }
  function sendMessage(){
    if(textMessage== ""){
      return
    }
      var message = {
        text: textMessage,
        createdAt: (new Date()).getTime(),
        user:{
          "_id":adminUUID(),
          name:"Admin"
        }
      }
    sendFirebaseMessage(currentInbox.id,message).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);

        window.db.collection("inboxs").doc(currentInbox.id).update({
            last_message :message.text,
            update_time: message.createdAt,
            unread_client: window.firebase.firestore.FieldValue.increment(1) 
        })
    })
    .catch(function(error) {
       window.showAlert(error)
    });
    setTextMessage("")

  }
  async function choiceInbox(data){
    if (currentInboxListener != null){
      currentInboxListener();
    }
    window.db.collection("inboxs").doc(data.id).update({
     unread:0
  })
 //   setMessageSource({})
 messages = {}
   
   var x = getMessage(data.id).orderBy("createdAt", 'desc');
 /*   x.get().then((data)=>{
    var result = []
    data.docs.forEach((e)=>{ 
     result.push({id:e.id,data:e.data()})
    })
    setOrgMessages(result)
    
  })*/
  
  currentInboxListener = x.onSnapshot(onSnapShot.bind(this))

 
  }
 
 
  function addMessages(data){ 
    var msgs =   Object.assign(messages,{});
    for ( var x of data ){ 
      msgs[x.id] = x;
    }   
   forceUpdate()
  }

  function onSnapShot(querySnapshot) {
  
    var listResult = []
    querySnapshot.docChanges().forEach(function(change) {
      if (change.type === "added") { 
        var doc = change.doc;
        listResult.push({id:doc.id,data:doc.data()});
      } 
   });
   onchange(listResult)

  }
  
   
  function onchange(doc){
    
    doc = doc.reverse ();
    addMessages(doc); 
    if (messagesEndRef  && messagesEndRef.current != null){
        messagesEndRef.current.scrollTop  =    messagesEndRef.current.scrollHeight
    }
  }
  
  function badgeInbox(data){
    if (data.unread <= 0 ){
      return
    }
    return <Badge color={"green"} text={data.unread}></Badge>
  }
  return (<Content title="Inbox" browserTitle="Inbox" >
      <Box  type="primary"  >
          <Row>

            <Col sm={3}>
              <div className="chat_list_panel" style={{background:"#FAFAFA"}}>
              {datasource.map((data)=>{
                  return (
                    <div onClick = {()=>{ 
                      setCurrentInbox(data)
                      choiceInbox(data)
                    }} className = "item-box-chat "key= {data["id"]} style= {{padding:5,position:"relative"}}>
                     <img src = { data["data"]["avatar"]} style={{width:50,height:50,borderRadius:25,border:"2px solid gray"}}>
                     </img>
                    <div style={{position:"absolute", top: 0 , left: 60}}>
                      <label>{data["data"]["name"]}</label>{ badgeInbox(data.data)}
                      <br></br>
                      <code style={{fontSize:10}}>{normalMessage(data["data"]["last_message"])}</code>
                    </div>
                    </div>
                  )
              })}
              </div>
            </Col>
            <Col sm={9}>
              <div class = "message-panel" style={{ position:"relative",minHeight:500, maxHeight:600}}>
               
                  {displayBoxChat()}

                </div>
            </Col>
          </Row>
      </Box>
  </Content>)
}

export default withRouter(QuanLyData)