import axios from 'axios';
import {
    HEADERS,
    BASEURL
} from '../constant/constant';

export const getProducts = () => {
    let url = `${BASEURL}classes/Product`;
    let headers = HEADERS;
    return axios.get(url, {headers});
}