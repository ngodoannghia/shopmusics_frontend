import React,{useState,useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { usePromiseTracker } from "react-promise-tracker";
import Modules from "./components"
import Login from "./components/login"
import Loader from 'react-loader-spinner';
import SweetAlert from 'sweetalert2-react';
 

const LoadingIndicator = props => {
     const { promiseInProgress } = usePromiseTracker({area:"loading"});
  
     return (
       promiseInProgress && 
      <div style={{position:"fixed",bottom:0,left:0,width:"100%",zIndex:999,textAlign:"center"}}>
        <Loader type="Rings" color="#2BAD60" height="100" width="100" />
      </div>
    );  
   }

   
const Alert = props => {
 const { promiseInProgress } = usePromiseTracker({area:"alert"});
    const [show,setShow ] = useState(false)
    const [message,setMessage ] = useState({message:"",title:""})
   window.showAlert = function(message,title=""){
    setShow(true)
    setMessage({message:message,title:title})
   }
     return ( 
          <SweetAlert
          show={show}
          title={message.title}
          html={message.message}
          onConfirm={() =>setShow(false)}
        />
    );  
}
 function App() {
  const[loading,setLoading] = useState(false)
  
  return   <div>
    
    <LoadingIndicator/>
    <Alert/>
    <Router  basename={'/admin'} >
      <Switch> 
          <Route exact  path="/login" component={Login}/>
          <Route  component={Modules}   />
      </Switch> 
    </Router>
    {loading?<div style={{top:0,left:0, position:"fixed",width:"100%", height:"100%",zIndex:999999,background:"#222d32"}}><div style={{position:"absolute",top:"calc(50% - 50px)",left:"calc(50% - 50px)", color:"white",textAlign:"center"}}> <div>Đang tải</div><Loader type="Rings" color="#2BAD60" height="100" width="100" /></div></div>:null}
    </div>
  
}

export default App;
