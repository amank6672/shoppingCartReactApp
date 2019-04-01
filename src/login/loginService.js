import axios from 'axios';
import {
    HEADERS,
    BASEURL
} from '../constant/constant';

export const loginUser = (userName,UserPassword) => {
    let headers = HEADERS;
    headers['X-Parse-Revocable-Session'] = '1';
    let url = `${BASEURL}login?username=${userName}&password=${UserPassword}`;
    return axios.get(url, {headers});
}