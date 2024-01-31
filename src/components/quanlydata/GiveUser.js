
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Infobox2, Inputs } from 'adminlte-2-react';
import { HOST,displayDate, findUserInfo,requestUserData,requestGetMusic, giveUserMusic,displayTitle } from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";

const { Text, Select } = Inputs

function EditData(props) {


  var [datasource, setDatasource] = useState({})
  var [audioUrl, setAudioUrl]= useState("")
  var [userInfo, setUserInfo]= useState({}) 
  var [userName, setUsernname]= useState("") 
  useEffect(() => {
    trackPromise(requestResource(), "loading")
  }, [])

  async function requestResource() {

    var data = await requestGetMusic(props.match.params.id) 
    if (data == null) {
      props.history.goBack()
    }
  
    setDatasource(data) 
  }
  
  function deleteAccount(){
      if (window.confirm("Bạn có muốn thực sự muốn giử bài hát này tới người dùng \""+ userInfo.info.fullname+"\" không?"   )){
        giveUserMusic(userInfo.uuid,datasource).then(()=>{
            window.showAlert("Giử thành công");
        }).catch(()=>{
            window.showAlert("Gửi thất bại. xin thử lại sau")
        })
      }
  }

  function searchUser(){
    findUserInfo(userName).then((data)=>{
        setUserInfo(data) 
    }).catch(()=>{
        window.showAlert("Không tìm thấy user này")
    })
  }
  
  var fullname =  null;
  if (userInfo.info != null){
    fullname = userInfo.info.fullname
  }
function displayUserInfo(){
    if (userInfo == null || userInfo.info == null){
        return
    }
    return (<div>
        <Row>
        <Col xs={3}><label>Tên user</label></Col>
         <Col xs={9}>{userInfo.info.fullname}</Col>
         
     </Row>
     <Row >
        <div style={{textAlign:"center"}}>
        <img style={{width:170,height:170}} src={userInfo.info.avatar}></img>
        </div>
     </Row> 
    </div>)
}

  return (<Content title={"Giử bài hát"} browserTitle={"Giử bài hát"}>
   <Col md={8}>
   <Box icon="fa-users" title={"Giử bài hát \""+datasource.title+"\" tới "+(fullname || "user" )}  header={
      <div style={{float:"right"}}>
          
      </div>
    }>
            
     <br/>
     
     <Row>
          <Text size="sm" label="Email người dùng" value={userName} onChange={(e) => {
            setUsernname(e.target.value)

          }} />
        </Row>
        <Row>
             <Col xs={2}>
           
            </Col>
            <Col xs={10}>
            <Button icon="fa-search" text="Tìm user" type="primary" onClick={()=>searchUser()}/>
            </Col>
        </Row>
        <hr></hr>
            {displayUserInfo()}
    </Box>
       
   </Col>

   <Col md={4}>
   <Box  >
         <Row> 
          <Col xs="12">
              {userInfo.info != null ?     <Button icon="fa-send" text={"Gửi bài hát đến " + userInfo.info.fullname} type="primary" onClick={()=>deleteAccount()}/>: null}
      
          </Col>
          </Row>
          <Row> 
              <br/>
          <Col xs="12">
          <Button icon ="fa-arrow-left" text="Quay lại" onClick={() => {
          props.history.goBack();
        }} /> 
          </Col>
          </Row>
          
    </Box>
       
   </Col>

  </Content>)
}
export default withRouter(EditData)
