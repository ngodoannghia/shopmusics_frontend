
import React,{useEffect, useState} from 'react'; 
 
import AdminLTE, { Inputs, Content, Row, Col, Box, Button,Badge  } from 'adminlte-2-react';
import {displayDate,requestVouchers,requestDeleteVoucher} from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";
import {baseurl} from "../config"
import copy from 'copy-to-clipboard';

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
  var [pagging,setPagging] =  useState([1])
  var status = []

  const [filterOption,setExFilterOption] = useState({
    limit:20,
    page:1, 
    status:-1,
    totalItem: 0
  }) 
 
 
  function refresh(){
    
 trackPromise(requestVouchers({...filterOption} ).then((data)=>{
  setDatasource(data);
  
}),"loading")
  }
  
  useEffect(()=>{

    refresh()
  },[])
   
  function deleteVoucher(data){
      if (window.confirm ("Bọn có thực sự muốn xóa mã quà tặng "+ data.code)){
          trackPromise(requestDeleteVoucher(data.uuid).then(()=>{
            refresh()
          }),"loading")
      }
  }
  
function renderItem(m,index){
  return <tr key={"item_"+(index+1)}>
    <td style={{cursor:"pointer "}} onClick={()=>{
        if (m.code != null){
          copy(m.code)
         }
    }}>{m.code}</td>
    <td> {displayEnable( (m.enable == true)?"Chưa sử dụng":"Đã sử dụng",m.enable)} </td>
    <td> {m.data} </td>
    <td> {m.time} giây </td>  
    <td> {m.type == 1 ? "Tặng bài hát":"Chưa cấu hình"} </td>  
    <td> <Button icon="fa-trash" type="danger"  text="Xóa" onClick = {()=>{
     deleteVoucher(m)
    }}/>
    </td> 
    </tr>
}
  return (<Content title="Danh sách Mã quà tặng" browserTitle="Danh sách Mã quà tặng">
      <Box  type="primary"
      
      footer ={ <div style={{float:"left"}} > <Col xs={12}> <code> Ấn vào mã để copy</code></Col> </div>}
      header = {<div>

        <div style={{float:"right"}}>
        
        <Button icon="fa-plus"  text="Tạo mới" onClick = {()=>{
      props.history.push(baseurl+"/voucher/create")
    }}/>
   
      </div>
     
        </div>}  >

      <Row>
       
      </Row>
          <table class="table table-bordered table-hover dataTable">
          <thead>
            <tr role="row">
              <th>Mã</th>
              <th>Trạng thái</th>
              <th>Data</th>  
              <th>Thời gian</th>  
              <th>Kiểu</th>
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