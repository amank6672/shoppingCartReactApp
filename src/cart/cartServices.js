import axios from 'axios';
import {
    HEADERS,
    BASEURL
} from '../constant/constant';

export const getCartItems = (userId) => {
    let headers = HEADERS;
    let url = `${BASEURL}classes/Cart?where={"UserId": { "__type": "Pointer", "className": "_User", "objectId": "${userId}" }}&include=UserID,ProductId`;
    return axios.get(url,{headers});
}