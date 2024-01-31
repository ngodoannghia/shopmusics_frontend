
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Inputs } from 'adminlte-2-react';
import { HOST,requestCategoryDetail,requestSaveCategory,requestUploadPhoto } from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";

const { Text } = Inputs

function EditData(props) {


  var [datasource, setDatasource] = useState({})
  var [isEdit, setIsEdit] = useState(false)

  useEffect(() => { 
    if (props.match.params.id){ 
        setIsEdit(true) 
        trackPromise(requestCategoryDetail(props.match.params.id).then((data)=>{
         
            setDatasource(data)
            console.log(data)
        }), "loading")
      } else {
        setIsEdit(false) 
      }
  },[])
  function handleSave(){
      
    try{
        requestSaveCategory(datasource).then((e)=>{ 
        props.history.goBack();
    }).catch(e=>{
        window.showAlert("Có lỗi xảy ra")
    })
    }catch {
      window.showAlert("Có lỗi xảy ra xin thử lại sau")
    }
  }

  function onChangeHandler(event){
    
    var file = event.target.files[0]
    const formData = new FormData()
    formData.append('file',file) 
    trackPromise(requestUploadPhoto(formData).then((data)=>{
      setDatasource({ ...datasource, thumb: data })
    })).catch((e)=>{
           window.showAlert("Upload hình ảnh thất bại")
    })
  }
  return (<Content title={"Thêm danh mục"} browserTitle={"Thêm danh mục"}>
    
   <Box icon="fa-users" title={"Thêm danh mục" }  header={
      <div style={{float:"right"}}>
        <Button text="Quay lại" onClick={() => {
          props.history.goBack();
        }} />   
      </div>
    }>
          <Row>
          <Text size="sm" label="Tên danh mục" value={datasource.title} onChange={(e) => {
            setDatasource({ ...datasource, title: e.target.value })

          }} />
        </Row>
        <br />
        <Row>
        
          <Col xs={2} >
          <label>Ảnh Cover</label>
          </Col>
          <Col xs={8}>
          <input type="file"  onChange={onChangeHandler} />
            <br/>
          <img src={datasource.thumb} style={{ width: 200, height: 200 }} >

        </img>
        <br/>
        <br/>
       
          </Col>
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
