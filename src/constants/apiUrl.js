
const apiUrl = {
    //HOST: "http://192.168.0.102:8080",
    HOST: "//13.232.187.25:8055",

    LOGIN: "/authentication/authenticate",
    LOGGEDIN_USER_GET: "/authentication/loggedInUser/get",
    APP_LOGIN_INFO_SAVE: "/authentication/appLoginInfo/save",
    APP_LOGIN_INFO_GET: "/authentication/appLoginInfo/get",

    USER_SAVE: "/user/save",
    USER_GET: "/user/get",
    USER_LIST_GET: "/user/list/get",
    USER_LIST_VIEW_GET: "/user/listview/get",
    USER_DELETE: "/user/delete",


    STATE_GET: "/formService/getState",
    PROPERTY_TAX_GET: "/formService/getPropertyTax",
    DATA_DRAFTING_SERVICE_SAVE: "/formService/save",
    DATA_DRAFTING_SERVICE_LIST_VIEW_GET: "/formService/listview/rawdata/get",
    DATA_DRAFTING_SERVICE_GET: "/formService/rawdata/get",
    DATA_DRAFTING_SERVICE_DELETE: "/formService/rawdata/delete",

    DATA_DRAFTING_SERVICE_RESULT_LIST_VIEW_GET: "/formService/listview/result/get",
    DATA_DRAFTING_SERVICE_RESULT_DOWNLOAD_EXCEL: "/formService/download/result/excel",
}

export default apiUrl;