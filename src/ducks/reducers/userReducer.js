import axios from 'axios';

const initialState = {
  user: {},
  users: {},
  trophies: {},
  didErr: false
};

const GET_USER = 'GET_USER';
const GET_USERS = 'GET_USERS';
const GET_TROPHY = 'GET_TROPHY';

export const getUser = () => {
  return {
    type: GET_USER,
    payload: axios.get('/api/me')
  };
};

export const getUsers = () => {
  return {
    type: GET_USERS,
    payload: axios.get('/api/users')
  };
};

export const getTrophy = () => {
  return {
    type: GET_TROPHY,
    payload: axios.get('/api/trophy')
  };
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case `${GET_USER}_FULFILLED`:
      return {
        ...state,
        ...action.payload.data
      };
    case `${GET_USERS}_FULFILLED`:
      return {
        ...state,
        users: action.payload.data
      };
    case `${GET_TROPHY}_FULFILLED`:
      return {
        ...state,
        trophies: action.payload.data
      };
    case `${GET_USER}_REJECTED`:
    case `${GET_USERS}_REJECTED`:
    case `${GET_TROPHY}_REJECTED`:
      return {
        ...state,
        didErr: true
      };
    default:
      return state;
  }
}
