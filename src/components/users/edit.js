import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Infobox2, Inputs } from 'adminlte-2-react';
import { HOST,displayDate, requestUserInfo, requestChangeAccount,requestUserData,requestAddData, acceptPenddingBuy,displayTitle,requestDeleteAccount } from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";
import {baseurl} from "../config"
const { Text, Select } = Inputs

function EditData(props) {


  var [datasource, setDatasource] = useState({info:{}})
  var [audioUrl, setAudioUrl]= useState("")
  var [isEdit, setIsEdit]= useState("") 
  useEffect(() => {
    trackPromise(requestResource(), "loading")
  }, [])

  async function requestResource() {

    var data = await requestUserData(props.match.params.id)
    if (data == null|| data.info == null) {
      props.history.goBack()
    }
  
    setDatasource(data) 
  }
  
  function deleteAccount(){
      if (window.confirm("Bạn có muốn xóa người dùng " + datasource.info.fullname )){
        requestDeleteAccount(datasource.uuid).then(()=>{
            props.history.goBack()
        })
      }
  }
  function changeAccountStatus(){
     var  status = (datasource.enable == true)?1:0
     console.log(status)
     if (window.confirm("Bạn có muốn " +(status == 1?"khóa":"mở khóa" )+ " người dùng " + datasource.info.fullname )){
        requestChangeAccount(datasource.uuid,1-status).then(()=>{
            trackPromise(requestResource(), "loading")
        })
      }
  }   
 


  return (<Content title={"Thông tin user"} browserTitle={"Thông tinuser"}>
   <Col md={8}>
   <Box icon="fa-users" title={"Thông tin user " + datasource.info.fullname}  header={
      <div style={{float:"right"}}>
        <Button text="Quay lại" onClick={() => {
          props.history.goBack();
        }} />   
      </div>
    }>
           <Row>
     <Col xs={3}><label>Ngày sinh</label></Col>
         <Col xs={9}><code style={{fontSize:14}}>{ displayDate(datasource.info.bod)}</code></Col>
     </Row>

     <br/>
  
    
     <Row>
     <Col xs={3}><label>Giới tính</label></Col>
         <Col xs={9}><div style={{fontSize:14}}>{ datasource.info.gender == 1 ?"Nam": datasource.info.gender == 2 ? "Nữ": "n/a"}</div></Col>
     </Row>
     <br/>
     <Row >
        <div style={{textAlign:"center"}}>
        <img style={{width:170,height:170}} src={datasource.info.avatar}></img>
        </div>
     </Row> 
    </Box>
       
   </Col>

   <Col md={4}>
   <Box  >
     <Row>
     <Col xs="12">
          <Button icon="fa-list" text="Danh sách bài hát đã mua" type="default" onClick={()=>{
            props.history.push(baseurl+"/user/storage/"+datasource.uuid)
          }}/>
          </Col>
     </Row>
     <br></br>
          
          <Row>
          <Col xs="6">
          <Button icon="fa-trash" text="Xóa tài khoản" type="danger" onClick={()=>deleteAccount()}/>
          </Col>
          <Col xs="6">
                {
                    (datasource.enable == false) ? <Button  onClick={()=>changeAccountStatus()} icon="fa-lock" text="Mở khóa tài khoản" type="warning"/> :<Button  onClick={()=>changeAccountStatus()} icon="fa-lock" text="Khóa tài khoản" type="warning"/>
                }
          </Col>
          </Row>
    </Box>
       
   </Col>

  </Content>)
}
export default withRouter(EditData)
