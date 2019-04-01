import {
  createStore
} from 'redux';

let userValue = window.localStorage.getItem('user');
let isLogggedInValue = window.localStorage.getItem('isLoggedIn');

const initialState = {
  isLogggedIn: isLogggedInValue ? true : false,
  user: userValue ? userValue : {},
  filters : []
}

function counter(state = initialState, action) {
  switch (action.type) {
    case "LOG_IN":
      console.log('Inside action Login', action.user)
      return state = {
        isLogggedIn: true,
        user: action.user
      }
    case "FILETR_UPDATE" :
      let localFilters = action.filters;
      console.log('filter Update');
      return state = {
        ...state,
        filters : localFilters
      }
    default:
      return state
  }
}

let store = createStore(counter);

store.subscribe(() => console.log(store.getState()))

export default store;