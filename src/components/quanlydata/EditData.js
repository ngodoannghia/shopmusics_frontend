
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Content, Row, Col, Box, Button, Infobox2, Inputs } from 'adminlte-2-react';
import { HOST,requestResourceUrl,nameToSlug, requestGetMusic, requestUpdateData,requestUploadPhoto,requestAddData,requestDeleteMusic,requestListCategory} from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";

const { Text, Select } = Inputs

function EditData(props) {

  var [sourceCategory,setCategories] = useState([])

  var [datasource, setDatasource] = useState({})
  var [audioUrl, setAudioUrl]= useState("")
  var [isEdit, setIsEdit]= useState("")
  var [title, setTitle]= useState("")
  useEffect(() => {
    if (props.match.params.id){
      setIsEdit(true) 
      setTitle("Sửa thông tin bài hát")
      trackPromise(requestResource(), "loading")
    } else {
      setIsEdit(false)

      setTitle("Thêm thông tin bài hát")
      
    }
  }, [])

  async function requestResource() {

    var data = await requestGetMusic(props.match.params.id)
    if (data == null) {
      props.history.goBack()
    }
    var categories = await requestListCategory();
    var source = []
    source.push({"text":"-- Bỏ trống --","value":null})
    for (var k of categories){
      source.push({"text":k.title,"value":k.uuid})
    }
   // setAudioUrl(HOST+"demo/stream/"+data.uuid+"/"+data.slug+".mp3"+"?t="+(new Date()).getTime() )
    requestResourceUrl(data.uuid).then((data)=>{
      setAudioUrl(data)
    })
    setDatasource(data) 
    setCategories(source)
  }

  function handleSave() {

    var func = requestUpdateData
    if (isEdit){
      func = requestUpdateData
    } else {
      func = requestAddData
      datasource.type = 2
      datasource.status = 0
      datasource.time = 0
    }
   
    func(datasource).then((data) => {
     
      if (isEdit){
        window.showAlert("Sửa thông tin thành công");
      } else {
        window.showAlert("Lưu thông tin thành công");
      }
      setIsEdit(true)
      setDatasource(data)
    }).catch((e) => {
      window.showAlert("Sửa thông tin không thành công");
    })
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
  function buttonDelete(){
    if (isEdit) {
    return (
      <Row>
        <Col sm ={2}> <label>Xóa bài hát </label></Col>
          <Col sm={8}>
             <Button type="danger" text={"Xóa bài hát " + datasource.title} onClick={
               ()=>{

                if (window.confirm('Bạn có muốn xóa bài hát ' + datasource.title)) {

                  requestDeleteMusic(datasource).then(()=>{
                    props.history.goBack();
                  })
                  
                } else { 
                 
                }
               }
             }></Button>
          </Col>
      </Row>
    )
    }
  }
  function uploadButton(){
    if (isEdit){
      return <Button type="primary" text="Upload Nhạc" onClick={() => {  
        if (props.match.params.id == null){

          window.showAlert("Bạn cần lưu thông tin nhạc demo trước");
          return 
        } 
       props.history.push("/admin/database/upload/"+datasource.uuid) 
       }} />
    }
  }
  return (<Content title={title} browserTitle={title}>
    <Box icon="fa-users" title={title} header = {
      <div style={{float:"right"}}>
        {datasource.status != 1 ? <Button icon="fa-upload" type="success" text="Publish" onClick={() => { 
              if (isEdit && datasource.uuid){
                datasource.status  = 1
             }
              handleSave()  
          }} /> :null } 

      </div>
    } footer={
      <div>
        <Button  icon="fa-arrow-left"  text="Quay lại" onClick={() => {
          props.history.goBack();
        }} />    <Button type="primary"  icon="fa-save"  text="Lưu" onClick={() => { handleSave() }} />
      </div>
    }>
      <form>
        <Row>
          <Text size="sm" label="Tên bài hát" value={datasource.title} onChange={(e) => {
            setDatasource({ ...datasource, title: e.target.value, slug: nameToSlug(e.target.value) })
          }} />
        </Row>
        <br />
        <Row>
          <Text size="sm" label="Slug" value={datasource.slug} />
        </Row>
        <br />

        <Row>
          <Text size="sm" label="Tác giả" value={datasource.author} onChange={(e) => {
            setDatasource({ ...datasource, author: e.target.value })

          }} />
        </Row>
        <br />
        <Row>
          <Text size="sm" label="Tiền / 1 phút" value={datasource.cost} onChange={(e) => {
            setDatasource({ ...datasource, cost: e.target.value })

          }} />
        </Row>
        <br />
        <Row>
           <Select  size="sm" label="Danh mục" options={sourceCategory}  
            value = {datasource.category}
            onChange= {(e)=>{
                setDatasource({...datasource,category:e.target.value})
            }}></Select>
        </Row>
        <br/>
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

        <Row>
          <Col xs={2} >
          <label>File nhạc</label>
          </Col>
          <Col xs={8}>
             <audio controls={true} src={audioUrl}>
              
              </audio>
              <br/>
        <br/>
               {uploadButton()}
            <br/>
        <br/>
          </Col>
        </Row>

        <br />

        {buttonDelete()}
      </form>
    </Box>

  </Content>)
}
export default withRouter(EditData)
