
import React,{useEffect, useState} from 'react'; 
import styles from "./styles.css"
import AdminLTE, { Inputs, Content, Row, Col, Box, Button,Badge  } from 'adminlte-2-react';
import {requestDeletePending,requestPenddingBuy,displayDateTime,displayTitle} from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";
import {baseurl} from "../config"

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

function PenddingBuy(props) {
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
 
 
  function reload(){
      trackPromise(requestPenddingBuy({...filterOption} ).then((data)=>{
        setDatasource(data.content);
        var totalPage = data["totalPages"];
        var pages = [];
        for (var i =1 ;i <= totalPage;i ++){
          pages.push(i);
        }
        setPagging(pages);
        setExFilterOption({...filterOption,totalItem:data["totalElements"]});
    }),"loading")
  }
  useEffect(()=>{
    reload() 
  },[])
  
  function setFilterOption(obj){
    if (obj.page == filterOption.page){
      obj.page = 1
    }
    setExFilterOption(obj);
    trackPromise(requestPenddingBuy(obj).then((data)=>{
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
    <td><code>{m.code}</code></td>
    <td>{displayTitle(m)}</td>
    <td>{ displayStatus(m.userName, m.status)  }</td> 
    <td>{m.cost}</td>
 
    <td>{displayDateTime(m.createAt)}</td> 
    <td>{displayDateTime(m.updateAt)}</td> 
    <td>{ displayStatus(m.status == 1? "Chấp nhận":m.status == 2? "Từ chối":"Chưa xác nhận", m.status)  }</td>
    <td> 
       <Button icon="fa-edit"  text="Chi tiết" onClick = {()=>{
        props.history.push(baseurl+"/penddingbuy/detail/"+m.uuid)
    }}/>  <Button icon="fa-trash"  text="Xóa" onClick = {()=>{
         if (window.confirm("Bạn có muốn xóa đơn này?")){
          requestDeletePending(m.uuid).then(()=>{
            reload()
          })
         }
    }}/>
    </td>
    </tr>
}
  return (<Content title="Danh sách chờ duyệt" browserTitle="Danh sách chờ duyệt ">
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
        
      </Row>
          }>
      <Row>
        
      </Row>
          <table class="table table-bordered table-hover dataTable">
          <thead>
            <tr role="row">
              <th>Mã</th>
              <th>Tên bài hát</th>
              <th>Người mua</th> 
              <th>Thành tiền</th> 
              <th>Ngày tạo</th>
              <th>Ngày duyệt</th>
              <th>Trạng thái</th>
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

export default withRouter(PenddingBuy)