import axios from 'axios';
import ApiURL from '../constants/apiUrl';

const instance = axios.create({
    baseURL: ApiURL.HOST,
    headers: {
        'content-type': 'application/octet-stream',
    },
});

export default {
    getToken: async (api, data) =>
        await instance({
            'method': 'POST',
            'url': api,
            'data': data,
            'headers': {
                'content-type': 'application/json'  // override instance defaults
            }
        }).then(response => {
            if (response.status && response.status == 200) {
                return response.data;
            } else {
                console.error("HTTP client error: Internal server error!");
            }
            return null;
        }).catch(error => {
            console.error(error);
        }),
    get: async (api, params) =>
        await instance({
            'method': 'GET',
            'url': api,
            'params': { params: JSON.stringify(params) },
            'headers': {
                'content-type': 'application/json',  // override instance defaults
                //'Authorization': `Bearer ${localStorage.getItem("token")}`
                ...getExtraHeaders()
            }
        }).then(response => {
            if (response.status && response.status == 200) {
                return response.data;
            } else {
                console.error("HTTP client error: Internal server error!");
            }
            return null;
        }).catch(error => {
            console.error(error);
            localStorage.removeItem("token");
            window.location.pathname = "/";
        }),
    post: async (api, data) =>
        await instance({
            'method': 'POST',
            'url': api,
            'data': data,
            'headers': {
                'content-type': 'application/json',  // override instance defaults
                ...getExtraHeaders()
            }
        }).then(response => {
            if (response.status && response.status == 200) {
                return response.data;
            } else {
                console.error("HTTP client error: Internal server error!");
            }
            return null;
        }).catch(error => {
            console.error(error);
            localStorage.removeItem("token");
            window.location.pathname = "/";
        }),
    delete: async (api, data) =>
        await instance({
            'method': 'DELETE',
            'url': api,
            'data': data,
            'headers': {
                'content-type': 'application/json',  // override instance defaults
                ...getExtraHeaders()
            }
        }).then(response => {
            if (response.status && response.status == 200) {
                return response.data;
            } else {
                console.error("HTTP client error: Internal server error!");
            }
            return null;
        }).catch(error => {
            console.error(error);
            localStorage.removeItem("token");
            window.location.pathname = "/";
        }),
    downloadFile: async (api, params) =>
        await instance({
            'method': 'GET',
            'url': api,
            responseType: 'blob',
            'params': { params: JSON.stringify(params) },
            'headers': {
                'content-type': 'application/json',  // override instance defaults
                //'Authorization': `Bearer ${localStorage.getItem("token")}`
                ...getExtraHeaders()
            }
        }).then(response => {
            if (response.status && response.status == 200) {
                return {status: 0, data: response.data};
            } else {
                console.error("HTTP client error: Internal server error!");
            }
            return null;
        }).catch(error => {
            console.error(error);
            localStorage.removeItem("token");
            window.location.pathname = "/";
        }),
}

const getExtraHeaders = () => {
    let headers = {};
    if (localStorage.getItem("token")) {
        headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    return headers;
}