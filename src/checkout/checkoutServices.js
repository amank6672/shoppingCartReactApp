import axios from 'axios';
import {
    HEADERS,
    BASEURL
} from '../constant/constant';

export const getProducts = (userId) => {
    let url = `${BASEURL}classes/Cart?where={"UserId": { "__type": "Pointer", "className": "_User",
        "objectId": "${userId}" }}&include=UserID,ProductId`;
    let headers = HEADERS;
    return axios.get(url, {headers});
}

export const createOrderAPICall = (orderObject) => {
    let url = `${BASEURL}classes/Orders`;
    let headers = HEADERS;
    return axios.post(url, orderObject, {headers});
}

export const deleteCartItemsAPICall = (id) => {
    let url = `${BASEURL}classes/Cart/${id}`;
    let headers = HEADERS;
    return axios.delete(url, {headers});
}