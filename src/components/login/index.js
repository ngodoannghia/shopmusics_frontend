import React, { useState } from "react";
import * as ApiService from "../../services/ApiService"
import { trackPromise } from 'react-promise-tracker';
import { withRouter } from "react-router";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  function doLogin(){
    if (loading){
      return;
    } 
    setLoading(true)
    trackPromise(new Promise((resolve)=>{
      
        ApiService.loginAdmin(username,password).then((data)=>{
            console.log(props)
            props.history.push("/")
            setLoading(false)
            resolve()
            trackPromise(new Promise((resolve)=>{}),"authen")
        }).catch(e=>{
            console.log(e)
            resolve()
            setLoading(false)
            window.showAlert("Đăng nhập thất bại!");
        })
    }),"loading")

  }
  return ( <div class="hold-transition login-page" style={{"textAlign":"center",position:"fixed",top:0,left:0,width:"100%",height:"100%"}} >
     <div style={{"textAlign":"center"}}> 
     <img style = {{width:"100%", "object-fit": "cover" , maxWidth:"600px"}} src="banner.jpg" ></img>
     </div>
    <div  style = {{height:"100%" }} >
    
  
    <div style={{position:"none", display:"inline-block", width:"100%",maxWidth:"600px",height:"100%"}} className="login-box-body">
      <p className="login-box-msg">Đăng nhập tài khoản quản trị</p>
  
      <div >
        <div className="form-group has-feedback">
          <input onChange = {(e)=>setUsername(e.target.value)} value={username} type="text" className="form-control" placeholder="username"/> 
        </div>
        <div className="form-group has-feedback">
          <input onChange = {(e)=>setPassword(e.target.value)} value={password} type="password" className="form-control" placeholder="Password"/> 
        </div>
        {!loading?
          <div className="col-6" >
            <button onClick={()=>{doLogin()}} type="submit" className="btn btn-primary btn-block btn-flat">Đăng Nhập</button>
          </div> :
          <div className="col-6" >
          <button  className="btn btn-default btn-block btn-flat...">Đang đăng nhập</button>
          </div> 
        }
      </div>
   
    </div>  
    </div> 
  </div>
  )
}

export default withRouter(Login)