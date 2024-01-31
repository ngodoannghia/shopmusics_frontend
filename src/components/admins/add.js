
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Infobox2, Inputs } from 'adminlte-2-react';
import { HOST,requestAddAdmin, requestUserInfo, requestChangeAccount,requestUserData,requestAddData, acceptPenddingBuy,displayTitle,requestDeleteAccount } from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";

const { Text, Select } = Inputs

function EditData(props) {


  var [datasource, setDatasource] = useState({})
 
  function handleSave(){
    try{
    requestAddAdmin(datasource).then((e)=>{ 
        props.history.goBack();
    }).catch(e=>{
        window.showAlert("Có lỗi xảy ra")
    })
    }catch {
      window.showAlert("Lỗi, nhập đầy đủ thông tin theo quy tắc, tên tài khỏan không đươc có khỏang trống ")
    }
  }


  return (<Content title={"Thêm admin"} browserTitle={"Thêm admin"}>
    
   <Box icon="fa-users" title={"Thêm admin" }  header={
      <div style={{float:"right"}}>
        <Button text="Quay lại" onClick={() => {
          props.history.goBack();
        }} />   
      </div>
    }>
          <Row>
          <Text size="sm" label="Tài khoản" value={datasource.account} onChange={(e) => {
            setDatasource({ ...datasource, account: e.target.value })

          }} />
        </Row>
        <br />
        <Row>
          <Text size="sm" label="Mật khẩu" value={datasource.cost} onChange={(e) => {
            setDatasource({ ...datasource, password: e.target.value })

          }} />
        </Row>
        <br />
        <br></br>
<hr></hr>
<Button type="primary" icon="fa-save" text="Lưu" onClick={() => {
           handleSave()
        }} />   

        
 </Box> 
  </Content>)
}
export default withRouter(EditData)
