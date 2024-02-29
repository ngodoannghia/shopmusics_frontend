var authToken = null
var userInfo = {};
var nhaMang = null;
var dataCategory = {};

const HOST = window.apiHOST
authToken = localStorage.getItem("token")

// Function old
try{ 
userInfo = JSON.parse( localStorage.getItem("userInfo")??"{}" )
 var date = (new Date()).getTime()
 if (date > userInfo.timestamp + 1000*60*60*14){
    clearData()
    authToken = null
    userInfo = {}
 }   
} catch {

}


function setToken (token){
    authToken = token;
    localStorage.setItem("token",token);

}

function setCookie (name, token){
    authToken = name + "=" + token
    localStorage.setItem("cookie", authToken);
}

function isAuthen(){
    return authToken != null
}

function clearData(){
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
}

function clearData2(){
    localStorage.removeItem("cookie");
    localStorage.removeItem("userInfo");
}

function setUserInfo(user){
    localStorage.setItem("userInfo",JSON.stringify(user));
    userInfo = user;
}
function getUsetInfo()
{
    return userInfo;
}
function getHeader(more = {}){
    return  {"Content-Type":"application/json",...more,token:authToken};  
}
function getHeader2(more = {}){
    return  {...more,token:authToken};  
}

function getHeader_cookie(more = {}){
    return  {"Content-Type":"application/json",...more,Cookie:authToken};  
}

function getHeader_cookie2(more = {}){
    return  {...more,Cookie:authToken};  
}

function requestGetMusic(id){
    var url = HOST+"music/detail/"+id;
    return fetch(url, { 
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        } 
        return json.data;
    });
}

function getMusic(id){
    var url = HOST + "api/song/" + id;
    return fetch(url, {
        headers: getHeader_cookie()
    }).then(res => res.json()).then(json =>{
        if (json.code != 200){
            throw "Request Failed"
        }
        return json.data;
    })
}

function getOriginMusic(id){
    var url = HOST+"music/detailbydemo/"+id;
    return fetch(url, { 
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        } 
        return json.data;
    });
}


function getDetailPenddingBuy(id){
    var url = HOST+"admin/penddingbuy/"+id+"/detail";
    return fetch(url, { 
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        } 
        return json.data;
    });
}

function acceptPenddingBuy(id,data){
    var url = HOST+"admin/penddingbuy/"+id+"/accept";
    var postdata = []
    for (var k in data){
        var item = data[k]
        if (item == null){
            continue;
        }
        postdata.push(item)
    } 
    return fetch(url, { 
        headers:  getHeader(),
        method: 'POST',
        body:JSON.stringify(postdata),
    }).then(res => res.json()).then(json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        } 
        return json.data;
    });
}


function rejectPenddingBuy(id){
    var url = HOST+"admin/penddingbuy/"+id+"/reject";
    return fetch(url, { 
        headers:  getHeader(),
    }).then(res => res.json()).then(json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        } 
        return json.data;
    });
}


function requestUpdateData(data){
    var url = HOST+"music/adminSaveMusic";
     return  fetch(url,{
        method: 'POST',
        mode: 'cors', 
        body:JSON.stringify(data),
        headers:  getHeader()
    }).then(res => res.json()).then(async json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        }  
        return json.data;
    });
}


function requestAddData(data){
    var url = HOST+"music/adminAdd";
     return  fetch(url,{
        method: 'POST',
        mode: 'cors', 
        body:JSON.stringify(data),
        headers:  getHeader()
    }).then(res => res.json()).then(async json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        }  
        return json.data;
    });
}
        

function requestLogin(username,password){
    var url = HOST + "admin/authenticate";
    console.log("url: ", url)
    console.log("host: ", HOST)
    return  fetch(url,{
        method: 'POST',
        mode: 'cors', 
        body:JSON.stringify({
            username:username,
            password:password
        }),
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code !=0){
            throw "Login failed"
            return;
        }  
        setToken(json.data.jwttoken);
        json.data.user.timestamp = (new Date()).getTime()
        setUserInfo(json.data.user);
        return json.data;
    });
}

function loginAdmin(username, password){
    var url = HOST + "api/admin/login"
    console.log("url: ", url)
    console.log("host: ", HOST)
    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            username:username,
            password:password
        }),
        headers: getHeader_cookie()
    }).then(res => res.json()).then(json => {
        if (json.code != 200){
            throw "Login failed"
        }
        setCookie(json.data.name, json.data.token);
        json.data.user.timestamp = (new Date()).getTime();
        setUserInfo(json.data);

        return json.data;
    })
}
    
function requestUploadAvatar(formData){
    var url = HOST+"util/avatar/upload";
    return fetch(url, {
        method: 'post',
        body: formData,
        headers:  getHeader2()
    }).then(res => res.json()).then(json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        } 
        return json.data;
    });
}

function requestUploadPhoto(formData){
    var url = HOST+"util/photo/upload";
    return fetch(url, {
        method: 'post',
        body: formData,
        headers:  getHeader2()
    }).then(res => res.json()).then(json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        } 
        return json.data;
    });
}

function requestUploadMusic(uuid,formData,uploadEvents){
    var url =  HOST+"util/music/upload/"+uuid;
   return new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
  
      xhr.open('POST', url, true);
      var headers = getHeader2();

      Object.keys(headers || {}).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });
  
      xhr.onload = e => res(e.target.responseText);
      xhr.onerror = rej;
  
      if (xhr.upload && uploadEvents != null) {
        Object.keys(uploadEvents).forEach((key) => {
          xhr.upload.addEventListener(key, uploadEvents[key]);
        });
      }
  
      xhr.send(formData);
    });
  
}


function requestUpdateUser(user){
    var url = HOST+"admin/update";
    return fetch(url, { 
        method: 'POST',
        mode: 'cors', 
        body:JSON.stringify(user),
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code !=0){
            throw "Request Failed"
            return;
        } 
        setUserInfo(json.data)
        return json.data;
    });
}

 

function requestDataFilter(filter){ 
   
    var request = { 
        page:filter.page-1,
        limit:filter.limit  ?? 20
    }  
    var url = HOST+"music/all/"+request.page+"?limit="+request.limit+"&sortType=desc";
 
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}

 
function requestUsers(filter){ 
   
    var request = { 
        page:filter.page-1,
        limit:filter.limit  ?? 20
    }  
    var url = HOST+"admin/users/"+request.page+"?limit="+request.limit;
 
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}

function requestUserInfo(uuid){ 
   
    var url = HOST+"user/info/"+uuid;
 
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}


function requestListAdmin(){ 
   
    var url = HOST+"admin/list";
 
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}



function requestAddAdmin(admin){ 
   
    var url = HOST+"admin/add";
    if (admin.username == null || admin.username == "" || admin.username.indexOf(" ") > 0){
        throw "Error request"
    }
 
    return  fetch(url,{
        method: 'POST',
        mode: 'cors', 
        body:JSON.stringify(admin),
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}


function requestUserData(uuid){ 
   
    var url = HOST+"admin/getuser/"+uuid;
 
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}

function requestReportDashboard(){ 
   
  
    var url = HOST+"admin/dashboard";
  
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}




function requestDeleteMusic(music){ 
   
  
    var url = HOST+"music/adminDelete";
  
    return  fetch(url,{
        method: 'POST',
        mode: 'cors', 
        body:JSON.stringify(music),
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}


function requestDeleteAccount(uuid){ 
   
  
    var url = HOST+"admin/deleteuser/"+uuid;
  
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        }  
        return json.data;
    });
}
function requestDeleteAdmin(uuid){ 
   
  
    var url = HOST+"admin/delete/"+uuid;
  
    return  fetch(url,{
        method: 'POST',  
        body: "",
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        return json.data;
    });
}

function requestChangeAccount(uuid,status){ 
   
  
    var url = HOST+"admin/updatestatus/"+uuid+"/"+status;
  
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
       
        return json.data;
    });
}

function requestResourceUrl(uuid){ 
   
  
    var url = HOST+"admin/resource/"+uuid;
  
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        }  
        return json.data;
    });
}


function requestPenddingBuy(filter){ 
   
    var request = { 
        page:filter.page-1,
        limit:filter.limit 
    }  
    var url = HOST+"admin/penddingbuy/"+request.page+"?limit="+request.limit;
 
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}

 
function requestVouchers(filter){ 
   
    var request = { 
        page:filter.page-1,
        limit:filter.limit 
    }  
    var url = HOST+"voucher/getall";
 
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}


function requestDeleteVoucher(uuid){ 
  
    var url = HOST+"voucher/delete/"+uuid +"?uuid="+uuid;
 
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        }  
        return json;
    });
}

function saveVoucher(data){
    var url = HOST+"voucher/save";
  
    return  fetch(url,{
        method: 'POST',  
        body: JSON.stringify(data),
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        return json.data;
    });
}

function findUserInfo(username){
    ///
    var url = HOST+"admin/user/"+username;
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        }  
        if (json.data == null){
            throw "not found"
            return;
        }
        return json.data;
    });
}


function giveUserMusic(userUUID,music){
    ///
    var url = HOST+"admin/give_music/"+userUUID;
    return  fetch(url,{
        method: 'POST',  
        body: JSON.stringify(music),
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        }  
        if (json.data == null){
            throw "not found"
            return;
        }
        return json.data;
    });
}


function requestStoreMusic(filter){ 
   
    var request = { 
        page:filter.page-1,
        limit:filter.limit  ?? 20
    }  
    var url = HOST+"music/all/"+request.page+"?limit="+request.limit+"&sortType=desc&type=1";

    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}





function removeUserStorage(uuid,useruuid){ 
    
    var url = HOST+"admin/userstorage/remove/"+uuid+"/"+useruuid;

    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        
        return json;
    });
}

function requestDeletePending(uuid){
    var url = HOST+"admin/deletepending/"+uuid;
    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        
        return json;
    });
}

function requestUserStorge(user_uuid,filter){ 
   
    var request = { 
        page:filter.page-1,
        limit:filter.limit  ?? 20
    }  
    ///admin/user/storage/{uuid}/{page}
    var url = HOST+"admin/user/storage/"+user_uuid+"/"+request.page+"?limit="+request.limit+"&sortType=desc&type=1";

    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}
function requestSaveCategory(category){
   
    var url = HOST+"admin/category/save";
    return  fetch(url,{
        method: 'POST',  
        body: JSON.stringify(category),
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        }  
        if (json.data == null){
            throw "not found"
            return;
        }
        return json.data;
    });
}


function requestCategoryDetail(uuid){ 
    
    var url = HOST+"admin/category/detail/"+uuid;

    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        }   
        return json.data;
    });
}

function requestListCategory(){ 
    
    var url = HOST+"music/categories";

    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}

function requestListByParent(uuid){ 
    
    var url = HOST+"admin/music/list/"+uuid;

    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        } 
        if (json.data == null ){
            throw "Error request"
        } 
        return json.data;
    });
}



function requestDeletetCategory(uuid){ 
    
    var url = HOST+"admin/category/delete/"+uuid;

    return  fetch(url,{
        method: 'GET',  
        headers:  getHeader()
    }).then(res => res.json()).then(json=>{
        if (json.code != 0){
            throw "Error request"
            return;
        }  
        return json.data;
    });
}
function nameToSlug(str) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "ảåàáãäâấèéëêếệẹìíïîĩợớơờòóöôộốùúüûủưừñç·/_,:;";
    var to =   "aaaaaaaaeeeeeeeiiiiioooooooooouuuuuuunc------";
  
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }
  
    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "_") // collapse whitespace and replace by -
      .replace(/-+/g, "_"); // collapse dashes
  
    return str;
  }

  function displayTime(time){
    if (time == null){
        return "N/a"
    }
    var a = new Date(time * 1);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =  hour + ':' + min  ;
    return time;
  }
  function displayDateTime(time){
    if (time == null){
        return "N/a"
    }
    var a = new Date(time * 1);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + month + '/' + year + '-' + hour + ':' + min + ':' + sec ;
    return time;
  }
  function displayDate(time){
    if (time == null){
        return "N/a"
    }
    var a = new Date(time * 1);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + month + '/' + year  ;
    return time;
  }
  function displayTitle(model){
      if (model.title != null && model.title != ""){
          return model.title
      }
      if (model.details == null){
          return "";
      }
      let listName = []
      for (var k of model.details){
        listName.push(k.title)
      }
      return listName.join(",")
  }

export  {
    requestLogin,
    setToken,
    isAuthen,
    getUsetInfo,
    requestDataFilter,
    requestUploadAvatar,
    requestUploadPhoto,
    clearData,
    requestGetMusic,
    requestUpdateData,
    requestAddData,
    requestUpdateUser,
    getOriginMusic,
    nameToSlug,
    requestUploadMusic,
    requestPenddingBuy,
    getDetailPenddingBuy,
    acceptPenddingBuy,
    rejectPenddingBuy,
    requestUsers,
    displayTime,
    displayDate,
    displayDateTime,
    displayTitle,
    requestReportDashboard,
    requestUserInfo,
    requestDeleteAccount,
    requestChangeAccount,
    requestUserData,
    requestDeleteMusic,
    requestListAdmin,
    requestAddAdmin,
    requestDeleteAdmin,
    requestVouchers,
    saveVoucher,
    requestDeleteVoucher,
    requestStoreMusic,
    findUserInfo,
    giveUserMusic,
    removeUserStorage,
    requestUserStorge,
    requestListCategory,
    requestCategoryDetail,
    requestSaveCategory,
    requestDeletetCategory,
    requestListByParent,
    requestResourceUrl,
    requestDeletePending,
    HOST,
    
    loginAdmin,
    getMusic
    
}