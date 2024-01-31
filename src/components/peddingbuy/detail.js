
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Infobox2, Inputs } from 'adminlte-2-react';
import { HOST,getDetailPenddingBuy, acceptlPenddingBuy, rejectPenddingBuy,requestUploadAvatar,requestListByParent, acceptPenddingBuy,displayTitle } from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";

const { Text, Select } = Inputs
var musics = {}
function EditData(props) {


  var [datasource, setDatasource] = useState({})
  var [audioUrl, setAudioUrl]= useState("")
  var [isEdit, setIsEdit]= useState("") 

  var [chooseData, setChooseData]= useState({}) 
  useEffect(() => {
    trackPromise(requestResource(), "loading")
  }, [])

  async function requestResource() {

    musics = []
    var data = await getDetailPenddingBuy(props.match.params.id)
    if (data == null) {
      props.history.goBack()
    }

    if (data.details != null){
        for(var item of data.details){
          var musicData = await requestListByParent(item.musicUuid)
          if (musicData != null) {
            musics[item.musicUuid] = [{text:"--- Chọn ---", value:null}]
            for (var x of musicData){
              musics[item.musicUuid].push({text:x.title,value:x.uuid})
            }
          }
        }
    }
  
    setDatasource(data) 
  }
  function accept(){ 
    trackPromise(acceptPenddingBuy(datasource.uuid, chooseData), "loading").then(()=>{
        requestResource()
    }).catch(()=>{
        props.history.goBack();
    })
  }
  function reject(){
    trackPromise(rejectPenddingBuy(datasource.uuid), "loading").then(()=>{
        requestResource()
    }).catch(()=>{
         props.history.goBack();
    })
  }

     
  function buttonAcceptReject(){
    if (datasource.status == 0) {
    return (
        <Row>
        <center>
        <Col xs={6}>
        <Button text="Đồng ý" type="success" onClick={() => {
         accept()
       }} />   
        </Col>
        <Col xs={6}>
        <Button  text="Không đồng ý" type="danger" onClick={() => {
        reject()
       }} />   
        </Col>
        </center>
    </Row>
    )
    }
    else {
       return ( <Row>
        <Col xs={3}><label>Trạng thái</label></Col>
       <Col xs={9}> Đã { datasource.status == 1? " chấp nhận":" từ chối" }</Col> 
  </Row>)
    }
  }

  function displayItemDetail(model){
      return (<div key={model.id}>
         <Row>
         <Col xs={3}><label>Tên bài hát</label></Col>
         <Col xs={9}> <div style={{fontSize:16}}> {displayTitle(model) } </div></Col>
        </Row>
        <Row>
        <Col xs={3}><label>Thời gian mua</label></Col>
            <Col xs={9}>{ model.time} giây</Col>
        </Row>
        <Row>
        <Select  size="sm" label="Nhạc gửi user" options={musics[model.musicUuid]}  
              value = {chooseData[model.musicUuid]}
              onChange= {(e)=>{
                var changeData = {...chooseData}
                changeData[model.musicUuid] = e.target.value
        
                setChooseData(changeData)
              }}></Select>
        </Row>
        <Row>
        <Col xs={3}><label>Thành tiền</label></Col>
            <Col xs={9}>{ model.cost}</Col>
        </Row>
        <hr></hr>
      </div>
        )
  }
  return (<Content title={"Thông tin mua nhạc"} browserTitle={"Thông tin mua nhạc"}>
   <Col md={6}>
   <Box icon="fa-users" title={"Thông tin mua nhạc"}  header={
      <div style={{float:"right"}}>
        <Button text="Quay lại" onClick={() => {
          props.history.goBack();
        }} />   
      </div>
    }>
           <Row>
     <Col xs={3}><label>Mã đơn</label></Col>
         <Col xs={9}><code style={{fontSize:18}}>{ datasource.code}</code></Col>
     </Row>
     <br/>
  
    
     <Row>
     <Col xs={3}><label>Thành tiền</label></Col>
         <Col xs={9}><div style={{fontSize:30}}>{ datasource.cost&&datasource.cost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }</div></Col>
     </Row>
     <hr></hr>
     <Row>
       <Col xs={12}> 
        <div style={{textAlign:"center"}}> <code> Có  { datasource.details? datasource.details.length: 0} bài trong đơn này</code> </div>
           <h4 className="box-title">Chi tiết</h4>
        
         </Col>
     </Row>
     {
       datasource.details&&datasource.details.map((m)=>displayItemDetail(m))
     } 
      {buttonAcceptReject()}
    </Box>
       
   </Col>

  </Content>)
}
export default withRouter(EditData)
