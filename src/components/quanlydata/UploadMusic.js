
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Infobox2, Inputs } from 'adminlte-2-react';
import { HOST,nameToSlug, requestGetMusic, requestUpdateData,requestUploadMusic } from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";

const { Text, Select } = Inputs

function UploadMusic(props) {

  const [loading,setLoading] = useState(false)
  var [datasource, setDatasource] = useState({})
  var [file, setFile] = useState(null) 
  var [uploadPercenter, setUploadPercenter] = useState(0) 
  
  useEffect(() => {
    trackPromise(requestResource(), "loading")
  }, [])

  async function requestResource() {

    var data = await requestGetMusic(props.match.params.id)
    if (data == null) {
      props.history.goBack()
    }
    
    setDatasource(data)


  }

  function handleSave() {

    if (loading){
      return
    }
    const formData = new FormData()
    formData.append('file',file) 
    setLoading(true)
    requestUploadMusic(datasource.uuid,formData,{ progress: (e) => {
        if (e.lengthComputable) {
          const progressPercent = parseInt((e.loaded / e.total) * 100, 10); 
                setUploadPercenter(progressPercent)
        }
    }}).then((x)=>{
      setLoading(false)
            var json = JSON.parse(x);
            if (json.code != 0){
                window.showAlert("Upload nhạc thất bại")
                return ;
            } 

            window.showAlert("Upload nhạc thành công")
    }).catch((e)=>{
      setLoading(false)
    })
  }

  function displayState(){
    if (uploadPercenter >= 100 && loading){
        return (<Col xs={12}>
          <br></br>
          <br></br> 
          <code>Đang xử lý xin chờ</code>
          <br></br> 
          <br></br>
          
        </Col>);
    }

  }
  function onChangeHandler(event){
    
    var file = event.target.files[0]
    setFile(file)
  }
  return (<Content title={"Upload nhạc cho bài hát"} browserTitle="Quản lý Nhạc">
    <Box icon="fa-users" title={"Upload nhạc: " +datasource.title +" "+ (datasource.type == 2 ? "bản demo" :"")}
    footer={
      <div>
        <Button text="Quay lại" onClick={() => {
          props.history.goBack();
        }} />    <Button type="primary" text="Lưu" onClick={() => { handleSave() }} />
      </div>
    }>
    <Row>
        <Col xs={12}>
        <input type="file" onChange={onChangeHandler} />
        </Col>
        <Col xs={12}>
        <progress id="progressBar" value={uploadPercenter} max="100" style={{width:300}}></progress>
        </Col>
        <br></br>
        <Col>
        {displayState()}
        </Col>
    </Row>
    </Box>

  </Content>)
}
export default withRouter(UploadMusic)
