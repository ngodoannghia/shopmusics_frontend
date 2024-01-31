
import React from 'react';
import Dashboard from "./dashboard"  
import QuanLyData from "./quanlydata"
import QuanLyMusicStore from "./quanlydata/storeMusic"
import Profile from "./profile" 
import EditDemo  from "./quanlydata/EditData"
import EditOrign  from "./quanlydata/EditOrigin"
import UploadMusic from "./quanlydata/UploadMusic"
import Import from './import'
import PenddingBuy from "./peddingbuy"
import PenddingBuyDetail from "./peddingbuy/detail"
import EditUser from "./users/edit"
import Admin from "./admins"
import AdminAdd from "./admins/add"
import Voucher from "./voucher"
import VoucherEdit from "./voucher/edit"
import Users from "./users"
import Chat from "./chat"
import GiveUser from "./quanlydata/GiveUser"
import UserStorage from "./users/storage"
import Category from "./category"
import CategoryEdit from "./category/edit"
import ChooseDemo from "./quanlydata/ChooseDemo"
import { Redirect} from "react-router";

import * as ApiService from "../services/ApiService"
import {baseurl} from "./config"
function Logout(){
    ApiService.clearData()
    window.location.reload()
    return <Redirect to="/login" />
}

const routers = [
    {
        path: baseurl+"/",
        component: Dashboard
    }, 
    {
        path:baseurl+"/category/:id",
        component:CategoryEdit
    },
    
    {
        path:baseurl+"/choosedemo",
        component:ChooseDemo
    },
    {
        path:baseurl+"/category",
        component:CategoryEdit
    },
    {
        path:  baseurl+"/categories",
        component: Category
    } ,
    {
        path:  baseurl+"/database",
        component: QuanLyData
    } ,
    {
        path:  baseurl+"/store/add/:demo",
        component: EditOrign
    },
    {
        path:  baseurl+"/store",
        component: QuanLyMusicStore
    } , {
        path:  baseurl+"/store/give/:id",
        component: GiveUser
    }
    ,
    {
        path:  baseurl+"/database/edit/:id",
        component: EditDemo
    },
    {
        path:  baseurl+"/database/origin/:id",
        component: EditOrign
    },
    {
        path:  baseurl+"/database/origin",
        component: EditOrign
    },
    {
        path:  baseurl+"/database/upload/:id",
        component: UploadMusic
    },
    {
        path:  baseurl+"/database/add",
        component: EditDemo
    },
    {
        path:  baseurl+"/penddingbuy",
        component: PenddingBuy
    } 
    , {
        path:  baseurl+"/voucher",
        component: Voucher
    } , {
        path:  baseurl+"/voucher/:id",
        component: VoucherEdit
    } 
    ,
    {
        path:  baseurl+"/penddingbuy/detail/:id",
        component: PenddingBuyDetail
    },
    
    {
        path:  baseurl+"/users",
        component: Users
    },
    
    {
        path:  baseurl+"/user/storage/:id",
        component: UserStorage
    },
    {
        path:  baseurl+"/users/:id",
        component: EditUser
    },
    {
        path:  baseurl+"/admins",
        component: Admin
    },
    {
        path:  baseurl+"/admins/add",
        component: AdminAdd
    },
    {
        path:  baseurl+"/chat",
        component: Chat
    },
    {
        path:  baseurl+"/chat/:id",
        component: Chat
    }
    ,
    {
        path:  baseurl+"/profile",
        component: Profile
    },

    {
        path:  baseurl+"/import",
        component: Import
    },
    {
        path:  baseurl+"/logout",
        component: Logout
    }
]


export default routers