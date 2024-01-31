
import React,{useEffect, useState} from 'react'; 
import styles from "./styles.css"
import AdminLTE, { Inputs, Content, Row, Col, Box, Button,Badge  } from 'adminlte-2-react';
import {requestDataFilter,requestStoreMusic,displayDateTime} from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";
import {baseurl} from "../config"
import copy from 'copy-to-clipboard';

const { Select, DateRange, DateTime, Text } = Inputs;

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
  var options = [{text:"Tất cả",value:-1}];
  var [pagging,setPagging] =  useState([1])
  var status = []

  const [filterOption,setExFilterOption] = useState({
    limit:20,
    page:1, 
    status:-1,
    totalItem: 0
  }) 
 
 
  
  useEffect(()=>{

    trackPromise(requestStoreMusic({...filterOption} ).then((data)=>{
      setDatasource(data.content);
      var totalPage = data["totalPages"];
      var pages = [];
      for (var i =1 ;i <= totalPage;i ++){
        pages.push(i);
      }
      setPagging(pages);
      setExFilterOption({...filterOption,totalItem:data["totalElements"]});
}),"loading")

  },[])
  
  function setFilterOption(obj){
    if (obj.page == filterOption.page){
      obj.page = 1
    }
    setExFilterOption(obj);
    trackPromise(requestStoreMusic(obj).then((data)=>{
          setDatasource(data.content);
          var totalPage = data["totalPages"];
          var pages = [1];
          for (var i =2 ;i <= totalPage;i ++){
            pages.push(i);
          }
          setPagging(pages);
          setExFilterOption({...obj,totalItem:data["totalElements"]});
    }),"loading")
  }
   
  
function renderItem(m,index){
  return <tr key={"item_"+(index+1)}>
    <td  style={{cursor:"pointer "}} onClick={()=>{
            if (m.uuid != null){
              copy(m.uuid)
            }
          }} ><code>{m.uuid}</code></td>
    <td>{m.title}</td>
    <td>{ displayStatus(m.slug, m.status)  }</td>
    <td>{m.time}</td>  
    <td>{m.author}</td>
    <td>{displayDateTime(m.createAt)}</td> 

    <td> 
    <Button icon="fa-edit"  text="Sửa" onClick = {()=>{
       props.history.push(baseurl+"/database/origin/"+m.uuid) 
    }}/>
    </td>
    </tr>
}
  return (<Content title="Quản lý Nhạc" browserTitle="Quản lý  Nhạc">
      <Box  type="primary" footer= {  <div style={{float:"left"}} > <Col xs={12}> <code> Ấn vào mã để copy</code></Col> </div>}   header  ={
      <Row>
         <Col xs={ 8 }> 
         
        <Col xs={ 12 }> 
          <Col xs={ 4 }> 
            <div className="nopadding ">
             <Select labelSm={6} sm={6} size="sm" label="Hiển thị"
              options={[1,10,20,50,100,200,500]}  
              value={filterOption.limit}
              onChange={(e)=>  
                setFilterOption({...filterOption,limit:e.target.value*1}) 
              }
               /> 
             </div>  
          </Col>
          <Col xs={8}> 
              
             <div className=" col-sm-6 nopadding">
             <Select labelSm={5} sm={7} size="sm" label="Trang"   
             options={pagging}  
             value={filterOption.page}
             onChange={(e)=>  
              setFilterOption({...filterOption,page:e.target.value*1}) 
            }
              />
             
             </div>  
             <div className=" col-sm-6 nopadding">
                <label> / {pagging.length}</label>
              </div>
          </Col>              
          </Col>     
        </Col>
       <Col xs={4}> <div style={{float:"right"}}>
        <Button icon="fa-plus" type="primary" text="Thêm mới" onClick={()=>{ props.history.push(baseurl+"/choosedemo") }} />
        </div></Col>
        
      </Row>
          }>
      <Row>
        
      </Row>
          <table class="table table-bordered table-hover dataTable">
          <thead>
            <tr role="row">
              <th>Mã</th>
              <th>Tên bài hát</th>
              <th>slug</th>
              <th>Thời gian (giây)</th> 

              <th>Tác giả</th>
              <th>Ngày tạo</th>
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