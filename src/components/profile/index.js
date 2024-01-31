
import React,{useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Infobox2,Inputs } from 'adminlte-2-react';

import * as ApiService from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';


const {Text,Select} = Inputs

function Profile( props) {

  const [datasource,setDatasource] = useState({})
	useEffect(()=>{ 
    var info = ApiService.getUsetInfo();
    if (info == null){
      setTimeout(()=>{
        var info = ApiService.getUsetInfo();
        setDatasource(info)
      },1000) 
    }else{
      setDatasource(info)
    }
  },"loading")
  
  function handleSave(){
    if (datasource.account == null || datasource.account.trim() == ""){
      window.showAlert("Không được bỏ trống tên đăng nhập");
      return 
    }
    if (datasource.password == null || datasource.password.trim() == ""){
      window.showAlert("Không được bỏ trống mật khẩu");
      return 
    }
    
    trackPromise(ApiService.requestUpdateUser(datasource).then((data)=>{
      window.showAlert("Lưu thông tin thành công");
    }).catch((e)=>{
      window.showAlert("Lưu thông tin thất bại");
    }),"loading")
  
  }
  return (<Content title="Thông tin quản trị" browserTitle="Thông tin quản trị">
     <Box  icon="fa-users" title="Thông tin quản trị" footer={
           <div>
               <Button type="primary" text="Lưu" onClick={()=>{ handleSave()}} />
           </div>
       }> 
          <Row>
              <Text size="sm" label="Tên đăng nhập" value = {datasource.account} onChange={(e)=>{
                   setDatasource({...datasource,account:e.target.value})
              }} />
          </Row>
          <br/>
          <Row>
              <Text size="sm" label="Mật khẩu mới" value = {datasource.password} onChange={(e)=>{
                   setDatasource({...datasource,password:e.target.value})
              }} />
          </Row>
        
          <br/>
           
      </Box>
  </Content>)
}

export default Profile