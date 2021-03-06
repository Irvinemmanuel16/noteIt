import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import jwtDecode from 'jwt-decode';

import { GET_ERRORS, USER_LOADING, SET_CURRENT_USER } from './types';

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/.netlify/functions/registerUser', userData)
    .then(() => {
      dispatch(clearErrors());
      history.push('/login');
    })
    .catch(res => dispatch({
      type: GET_ERRORS,
      payload: res?.response?.data
    }));
};

export const loginUser = userData => async dispatch => {
  try {
    let response = await axios.post('/.netlify/functions/loginUser', userData)
    let { token } = await response.data
    localStorage.setItem('jwtToken', token);
    setAuthToken(token);
    const decoded = jwtDecode(token);
    dispatch(clearErrors());
    dispatch(setCurrentUser(decoded));
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response?.data
    })
  }
  
  //   .then(res => {
  //     console.log(res)
  //     const { token } = res.data;
  
  //   .catch(() => {
  //     console.log(res?.response)
  //   //   
  // });
};

export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});

export const setUserLoading = () => ({
  type: USER_LOADING
});

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken');
  dispatch(setCurrentUser({}));
};

export const clearErrors = () => ({
  type: GET_ERRORS,
  payload: {}
});