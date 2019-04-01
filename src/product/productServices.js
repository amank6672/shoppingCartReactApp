import axios from 'axios';
import {
    HEADERS,
    BASEURL
} from '../constant/constant';
export const getProduct = (productId) => {
    let headers = HEADERS;
    let url = BASEURL+'classes/Product?where={"objectId": "' + productId + '"}&include=SellerId';
    return axios.get(url,{headers});
}

export const placeOrder = (object) =>{   
    let url = BASEURL + '/classes/Cart';
    let headers = HEADERS;
    headers['Content-Type'] = 'application/json';
    return axios.post(url, object, {headers});

}
export const checkProductAlreadyInCart = (productId,userId) =>{
    let url = BASEURL + `/classes/Cart?where={ "ProductId": { "__type": "Pointer", "className": "Product", "objectId": "${productId}" }, "UserId": { "__type": "Pointer", "className": "_User", "objectId": "${userId}" } }`;
    let headers = HEADERS;
    return axios.get(url, {headers});
}
export const updateOrder = (object) => {
    let url = BASEURL + `classes/Cart/${object.objectId}`;
    delete object.objectId;
    let headers = HEADERS;
    headers['Content-Type'] = 'application/json';
    return axios.put(url,object,{headers});
}