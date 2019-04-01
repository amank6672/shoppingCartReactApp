import axios from 'axios';
import {
    HEADERS,
    BASEURL
} from '../constant/constant';
export const getUser = (userId) => {
    let headers = HEADERS;
    let url = `${BASEURL}users/${userId}`;
    return axios.get(url,{headers});
}
export const getAddress = (userId) => {
    let headers = HEADERS;
    let url = `${BASEURL}classes/Address?where={ "User": { "__type": "Pointer", "className": "_User", "objectId": "${userId}" }}&include=User`;
    return axios.get(url,{headers});
}
export const editAddress = (addressObject) => {
    let headers = HEADERS;
    headers['Content-Type'] = 'application/json';
    let url = `${BASEURL}classes/Address/${addressObject.objectId}`;
    delete addressObject.objectId;
    delete addressObject.User;
    delete addressObject.updatedAt;
    delete addressObject.createdAt;
    return axios.put(url, addressObject, {headers});
}

export const updateUser = (userId,userObject,sessionToken) => {
    let headers = HEADERS;
    headers['Content-Type'] = 'application/json';
    headers['X-Parse-Session-Token'] = sessionToken;
    let url = `${BASEURL}users/${userId}`;
    return axios.put(url, userObject, {headers});
}