
import React,{useEffect, useState} from 'react'; 
import styles from "./styles.css"
import AdminLTE, { Inputs, Content, Row, Col, Box, Button,Badge  } from 'adminlte-2-react';
import {getUsetInfo,requestListAdmin,displayDateTime,requestDeleteAdmin} from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";
import {baseurl} from "../config"

const { Select, DateRange, DateTime, Text } = Inputs;

function displayStatus(slug, status){
  var statusStr =  slug;
  var color ="black"
  if (status == 2){
    color="yellow"
  } else  if (status == 1){
    color="green"
  } else  if (status == 3){
    color="red"
  }

return <Badge color={color} text={statusStr}></Badge>
}
function displayEnable(slug, status){
  var statusStr =  slug;
  var color ="black"
  if (status != true){
    color="red"
  } else{
    color="green"
  }  

return <Badge color={color} text={statusStr}></Badge>
}

function QuanLyData(props) {
  var categories = [];
  var [datasource,setDatasource] = useState([])
  var options = [{text:"Tất cả",value:-1}];
  
  var status = []
 
 
  
  useEffect(()=>{

    trackPromise(requestListAdmin().then((data)=>{
      setDatasource(data);
       
}),"loading")

  },[])
   
   
  
function renderItem(m,index){
    var info =  getUsetInfo();
    if (m.uuid == info.uuid){
        return
    }
  return <tr key={"item_"+(index+1)}>
    <td>{m.account}</td>
    <td>{displayDateTime(m.create_at)}</td>
    
    <td><Button  icon="fa-trash"  text="Xóa" onClick = {()=>{
     if (window.confirm("Bạn có muốn xóa tài khoản " +m.account)){
        requestDeleteAdmin(m.uuid).then(()=>{
            trackPromise(requestListAdmin().then((data)=>{
                setDatasource(data); 
            }),"loading")
        })
     }
    }}/>   
    </td> 
    </tr>
}
  return (<Content title="Danh sách người dùng" browserTitle="Danh sách người dùng">
      <Box  type="primary"   header  ={<div><Button  icon="fa-plus"  text="Thêm mới" onClick = {()=>{
          props.history.push(baseurl+"/admins/add")
      }}/> </div> } >

          <table class="table table-bordered table-hover dataTable">
          <thead>
            <tr role="row">
              <th>Tên đăng nhập</th>
              <th>Ngày lập</th>
              
              <th></th> 
            </tr>
            </thead>
            <tbody>
                 {
                   datasource.map((m,index)=>renderItem(m,index))
                 }
            </tbody>
          </table>
      </Box>
  </Content>)
}

export default withRouter(QuanLyData)