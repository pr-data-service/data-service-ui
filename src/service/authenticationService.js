import apiUrl from "../constants/apiUrl"
import HttpClient from "./httpClient"



const getToken = (params) => {
    try{
        return HttpClient.getToken(apiUrl.LOGIN, params);        
    }catch(error){
        console.error(error);
    }    
}

const saveAppLoginInfo = (params) => {
    try{
        return HttpClient.post(apiUrl.APP_LOGIN_INFO_SAVE, params);        
    }catch(error){
        console.error(error);
    }    
}

const getAppLoginInfo = () => {
    try{
        return HttpClient.get(apiUrl.APP_LOGIN_INFO_GET);        
    }catch(error){
        console.error(error);
    }    
}

const savePassword = (params) => {
    try{
        return HttpClient.post(apiUrl.PASSWORD_CHANGE, params);        
    }catch(error){
        console.error(error);
    }    
}


export default {
    getToken,
    saveAppLoginInfo,
    getAppLoginInfo,
    savePassword
}