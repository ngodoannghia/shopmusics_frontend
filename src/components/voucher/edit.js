
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Infobox2, Inputs } from 'adminlte-2-react';
import { HOST,displayDate,requestUserData,getOriginMusic,saveVoucher } from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";
import copy from 'copy-to-clipboard';

const { Text, Select } = Inputs

function EditData(props) {


  var [datasource, setDatasource] = useState({time:60})
  var [music, setMusic] = useState({})
  
  var [audioUrl, setAudioUrl]= useState("")
  var [isEdit, setIsEdit]= useState("") 
  useEffect(() => {
    trackPromise(requestResource(), "loading")
  }, [])

  async function requestResource() {

   
  }
  
  function displayMusic(){
      if (music != null && music.uuid != null){
            return (
                <div>
                     <Row>
                        <Col xs={3}><label>Tên bài hát </label></Col>
                            <Col xs={9}> {music.title} </Col>
                    </Row>
                    <Row>
                    
                    <Col xs={2} >
                    <label>Ảnh Cover</label>
                    </Col>
                    <Col xs={8}>
                   
                    <img src={music.thumb} style={{ width: 200, height: 200 }} >

                </img>
                <br/>
                <br/>
                
                    </Col>
                </Row>
                </div>
            )
      }
      else 
      {
          return
    }
  }
  function saveData(){
    if (datasource == null || datasource.data == null || datasource.data == ""){
        return;
    }
    datasource.type = 1
    datasource.enable = true
    trackPromise(saveVoucher(datasource).then((data)=>{
        console.log(data)
        if (data != null){
            setDatasource(data)
            getOriginMusic(data.data).then((data)=>{
                setMusic(data)
            })
            
        }  
    }).catch((e)=>{
        window.showAlert("Data không tồn tại")
    }),"loading")
  } 

  return (<Content title={"Mã quà tặng"} browserTitle={"Mã quà tặng"}>
      <Row>
   <Col md={8}>
   <Box icon="fa-users" title={"Mã quà tặng "}   >
           <Row>
     <Col xs={3}><label>Mã</label></Col>
        <Col xs={9}><code  style={{cursor:"pointer "}} onClick={()=>{
            if (datasource.code != null){
                copy(datasource.code)
            }
        }} style={{fontSize:14}}>{datasource.code || "Chưa lưu"}</code></Col>
     </Row>

     <br/>
  
    
     <Row>
     <Col xs={3}><label>data </label></Col>
         <Col xs={9}> <input onChange={(e) => {
            setDatasource({ ...datasource, data: e.target.value })

          }} 
          placeholder="Mã bài hát" type="text" value = {datasource.data}></input></Col>
     </Row>
     <br/>
     <Row>
     <Col xs={3}><label>Thời gian (giây) </label></Col>
         <Col xs={9}> <input  onChange={(e) => {
            setDatasource({ ...datasource, time: e.target.value*1 }) }}

            type="number" value = {datasource.time}></input></Col>
     </Row>
            <hr/>
     {displayMusic()}
            
    </Box>
       
   </Col>

   <Col md={4}>
   <Box  >
         <Row>
          <Col xs="12">
          <Button text="Quay lại" onClick={() => {
          props.history.goBack();
        }} />  
          </Col>
          </Row>
          <br></br>
          <Row>
          <Col xs="12">
          <Button icon="fa-save" text="Lưu" type="primary" onClick={()=>saveData()}/>
          </Col>
          </Row>
    </Box>
       
   </Col>

   
       
   </Row>
   <Row>
       <Col xs= {12}>

       <Box  >
         <Row>
          <Col xs="12">
                <code>
                    Data là mã của bài hát, copy mã bài hát cần tặng vào trường  data
                    <br></br>
                    Sau khi lưu mã qùa tặng sẽ được tạo.
                </code>
          </Col>
          </Row>
    </Box>
       </Col>
       
   </Row>

  </Content>)
}
export default withRouter(EditData)
