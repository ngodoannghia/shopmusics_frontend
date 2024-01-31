
import React,{useEffect,useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AdminLTE, { Sidebar, Content, Row, Col, Box, Button, Infobox2 } from 'adminlte-2-react';
import {Doughnut,Bar,Line} from 'react-chartjs-2';   
import { trackPromise } from 'react-promise-tracker';
import {requestReportDashboard} from  "../../services/ApiService"
 

const data = {
  labels: ['1', '2', '3', '4', '5', '6', '7'],
  datasets: [
    {
      label: 'bài hát',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};


function Dashboard() {
    
  var [datasource,setDatasource] = useState({})
 useEffect(()=>{
  requestReportDashboard().then((data)=>{
    setDatasource(data)
  })
 },[])

  return (<Content title="" browserTitle="Dashboard">
    <div>
    <br></br>
    <img style = {{width:"100%", "object-fit": "cover", height:200 }} src="banner.jpg" ></img>
    </div>
     <br></br>
    <Row>
       
      <Col xs={6} lg={4}>
        <Infobox2 to={"#"} footerIcon={""} onFooterClick={()=>{}} icon="fa-users" title={datasource.totalUser} color="blue" text="Tổng số người dùng" number="" />
      </Col>
      <Col xs={6} lg={4}>
        <Infobox2 to={"#"} footerIcon={""} onFooterClick={()=>{}} icon="fa-music" title={datasource.totalMusic} color="aqua" text="Tổng số bài hát" number="" />
      </Col>
      <Col xs={6} lg={4}>
        <Infobox2 to={"#"} footerIcon={""} onFooterClick={()=>{}} icon="fa-shopping-cart" title={datasource.totalNewPenddingBuy} color="yellow" text="Tổng số yêu cầu mua hàng chưa duyệt" number="" />
      </Col>
      <Col xs={6} lg={4}>
         <Infobox2 to={"#"} footerIcon={""} onFooterClick={()=>{}} icon="fa-check" title={datasource.totalAccept} color="green" text="Tổng số đơn hàng thành công" number="" />
       </Col>
       <Col xs={6} lg={4}>
         <Infobox2 to={"#"} footerIcon={""} onFooterClick={()=>{}} icon="fa-times-circle" title={datasource.totalRejectPenddingBuy} color="red" text="Tổng số đơn hàng từ chối" number="" />
       </Col>
  
       
    </Row>
     
    <Row>
      {
    /*  <Col xs={12}>
        <Box icon="fa-chart-pie" title="Thống kê dữ liệu chưa gọi"> 
        <Doughnut data={data} />
        </Box>
      </Col>*/
}
<hr></hr>
<br>
</br>
<Col md={2}></Col>
    <Col md={8}><Line   data={data} /></Col>
    <Col md={2}></Col>
    </Row>
  </Content>)
}

export default Dashboard