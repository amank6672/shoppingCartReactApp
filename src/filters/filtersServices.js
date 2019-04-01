import axios from 'axios';
import {
    HEADERS,
    BASEURL
} from '../constant/constant';
export const getCategories = (userId) => {
    let headers = HEADERS;
    let url = `${BASEURL}classes/Product`;
    return axios.get(url,{headers}).then((response)=>{
        let searchObjectArray = response.data.results;
        let lookup = {};
        let result = [];
        for (let object, i = 0; i < searchObjectArray.length ;) {
            object = searchObjectArray[i++]
            let category = object.Category;
            if (!(category in lookup)) {
              lookup[category] = 1;
              result.push(category);
            }
        }
        return result;
    });
}