import {
    HEADERS,
    BASEURL
} from '../constant/constant';
import axios from 'axios';

export const getOrders = (userId) => {
    let url = `${BASEURL}classes/Orders?where={"UserId": { "__type": "Pointer", "className": "_User", "objectId": "${userId}"}}`;
    let headers = HEADERS;
    return axios.get(url, {headers});
}

export const getOrderDetail = (orderId) => {
    let headers = HEADERS;
    let url = `${BASEURL}classes/Orders?where={"objectId": "${orderId}"}`;
    return axios.get(url, {headers});
}