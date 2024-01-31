
import React,{useEffect,useState} from 'react'; 
import { Sidebar } from 'adminlte-2-react';
import * as ApiService from "../services/ApiService"
import { usePromiseTracker } from "react-promise-tracker";
import {baseurl} from "./config"
const { Item, Header,UserPanel} = Sidebar;


function HookUserPanel(){ 
    const { promiseInProgress } = usePromiseTracker({area:"authen"});
    let info = ApiService.getUsetInfo()
    return (<UserPanel status="Chỉnh sửa" username={info.account} imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQAZyFdywMPXJlTpPImDs4x5RkRvjCqAk6tsA&usqp=CAU" link={baseurl+"/profile"}/>)
    
}
   
export default [
    <HookUserPanel/> ,
    <Header key="header1" text="Các chức năng quản lý" />,
    <Item key="dashboard" text="Dashboard" to={baseurl+"/"} icon="fa-tachometer-alt" />,    
    <Item key="data1" text="Quản lý danh sách nhạc" to={baseurl+"/database"} icon="fa-database" />,
    <Item key="store" text="Quản lý danh sách nhạc gốc" to={baseurl+"/store"} icon="fa-database" />,
    <Item key="data2" text="Danh sách duyệt mua" to={baseurl+"/penddingbuy"} icon="fa-shopping-cart" />,
    <Item key="categiry" text="Danh mục" to={baseurl+"/categories"} icon="fa-list" />,
    <Item key="voucher" text="Mã quà tặng" to={baseurl+"/voucher"} icon="fa-gift" />,
    <Header  key="header2" text="Chức năng khác" />,

    <Item key="data3" text="Danh sách người dùng" to={baseurl+"/users"} icon="fa-user" />,
    <Item key="chat" text="Inbox" to={baseurl+"/chat"} icon="fa-paper-plane" />,
    <Item key="admin" text="Danh sách admin" to={baseurl+"/admins"} icon="fa-users" />,
    <Item key="dangxuat" text="Đăng xuất"  to={baseurl+"/logout"}  icon="fa-sign-out-alt" />
 ];