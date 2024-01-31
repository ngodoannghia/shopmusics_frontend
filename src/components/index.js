import React from 'react';
import { Redirect} from "react-router";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button } from 'adminlte-2-react';
import GnSidebar from "./Sidebar";
import routers from "./Router"
import * as ApiService from "../services/ApiService"
function App() {
  
  let isAuthen = ApiService.isAuthen()
  
  return (
    isAuthen ?
    <AdminLTE title={["Shop", "Music"]} titleShort={["S", "M"]} theme="blue" sidebar= {GnSidebar}>
     {
      routers.map((m)=>{
        let Component = m.component;
        return <Component exact path = {m.path}></Component>
      })
      }
    </AdminLTE> :<Redirect to="/login" />

  );
}

export default App;
