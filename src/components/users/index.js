
import React,{useEffect, useState} from 'react'; 
import styles from "./styles.css"
import AdminLTE, { Inputs, Content, Row, Col, Box, Button,Badge  } from 'adminlte-2-react';
import {displayDate,requestUsers} from "../../services/ApiService"
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
  var [pagging,setPagging] =  useState([1])
  var status = []

  const [filterOption,setExFilterOption] = useState({
    limit:20,
    page:1, 
    status:-1,
    totalItem: 0
  }) 
 
 
  
  useEffect(()=>{

    trackPromise(requestUsers({...filterOption} ).then((data)=>{
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
    trackPromise(requestUsers(obj).then((data)=>{
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
    <td>{displayEnable(m.account,m.enable)}</td>
    <td>{m.info.fullname}</td>
    <td>{ displayStatus((m.info.gender==1?"Nam":m.info.gender==null?"N/a":"Nữ"), m.info.gender)  }</td>
    <td>{displayDate(m.info.bod)}</td>  
    <td><Button icon="fa-paper-plane"  text="Gửi tin nhắn" onClick = {()=>{
      props.history.push(baseurl+"/chat/"+m.uuid)
    }}/>  <Button icon="fa-edit"  text="Chi tiết" onClick = {()=>{
      props.history.push(baseurl+"/users/"+m.uuid)
    }}/>
    </td> 
    </tr>
}
  return (<Content title="Danh sách người dùng" browserTitle="Danh sách người dùng">
      <Box  type="primary"   header  ={
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
         
        </div></Col>
      </Row>
          }>
      <Row>
        
      </Row>
          <table class="table table-bordered table-hover dataTable">
          <thead>
            <tr role="row">
              <th>Tên đăng nhập</th>
              <th>Tên người dùng</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th> 
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