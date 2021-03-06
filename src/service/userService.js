import apiUrl from "../constants/apiUrl"
import HttpClient from "./httpClient"



const saveUser = (params) => {
    return HttpClient.post(apiUrl.USER_SAVE, params);
}

const getUserById = (id) => {
    try{
        return HttpClient.get(apiUrl.USER_GET+"/"+id);
    }catch(error){
        console.error(error);
    }  
}

const getLoggedInUser = () => {
    try {
        return HttpClient.get(apiUrl.LOGGEDIN_USER_GET);
    } catch(error) {
        console.error(error);
    }  
}

const getAllActiveUser = () => {
    try{
        return HttpClient.get(apiUrl.USER_LIST_GET);
    }catch(error){
        console.error(error);
    }  
}

const getAllAdminUser = () => {
    try{
        return HttpClient.get(apiUrl.USER_LIST_ADMIN_GET);
    }catch(error){
        console.error(error);
    }  
}

const getListViewData = (params) => {
    try{
        return HttpClient.get(apiUrl.USER_LIST_VIEW_GET, params);
    }catch(error){
        console.error(error);
    }  
}

const deleteUserById = (id) => {
    try{
        return HttpClient.delete(apiUrl.USER_DELETE+"/"+id);        
    }catch(error){
        console.error(error);
    }  
}

const addToParent = (params) => {
    return HttpClient.post(apiUrl.USER_ADD_TO_PARENT, params);
}

const removeFromParent = (params) => {
    return HttpClient.post(apiUrl.USER_REMOVE_FROM_PARENT, params);
}

const activeOrDeactive = (params) => {
    return HttpClient.post(apiUrl.USER_ACTIVE_OR_DEACTIVE, params);
}

export default {
    saveUser,
    getUserById,
    getLoggedInUser,
    getAllActiveUser,
    getAllAdminUser,
    getListViewData,
    deleteUserById,
    addToParent,
    removeFromParent,
    activeOrDeactive
}