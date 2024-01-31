import React, {useState} from 'react';
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Inputs } from 'adminlte-2-react';
 
import { trackPromise } from 'react-promise-tracker';
const {Text,Select}= Inputs
function Import() {

    const [file,setFile] = useState(null)
    const [category,setCategory] = useState(null)
    const [loading,setLoading] = useState(false)
    let categories = [];
    let categoryOption = [];
    for (var k in categories){
        categoryOption.push({
            text: categories[k].name,
            value: categories[k].id
        })
      }

      function onChangeHandler(event){
    
        setFile(event.target.files[0])

      }
      function onImport(){
          var cg = category;
          if (cg == null || cg ==0 ){
            cg = categoryOption[0].value
          }
          console.log("category",cg)
          const formData = new FormData()
          formData.append('file',file)
          formData.append('category',cg)
       /* trackPromise(requestUploadFile(formData).then((data)=>{
	   var totalSuccess = data[0]
           var totalImport = data[1]
           var totalError = totalImport - totalSuccess
			  window.showAlert(`Import dữ liệu thành công <br><br>  <div style="text-align:left"> Tổng số dữ liệu import:<b> ${totalImport}</b> <br/> Số thành công: <b>${totalSuccess}</b><br/>Số thất bại: <b>${totalError}</b><div/>`)
        })).catch((e)=>{
          window.showAlert("Import dữ liệu thất bại")
      })*/
      }
  return (<Content title="Nhập dữ liệu" browserTitle="Nhập dữ liệu">
    <Box title="Nhập dữ liệu từ file excel"  type ="primary">
    <Row>
    <div className="col-sm-6">
                <div class="form-group">
                <label>Loại dữ liệu</label>
              <Select md={6} size="sm" labelPosition = "none"
               options={categoryOption} 
               
               onChange= {(e)=>{
                setCategory(e.target.value*1)
            }}
            
                />
                </div>
                </div>

          </Row>
          <Row>
                <div className="col-sm-6">
                <div class="form-group">
                <label>Loại dữ liệu</label>
                    <input type="file"  onChange={onChangeHandler} />
            </div>
                </div>
          </Row>
            <Row>
               <Col sm={12}>
                <Button type="primary" text="Import" onClick={()=>{
                    onImport()
                }} />
               </Col>
            </Row>
    </Box>
  </Content>)
}

export default Import