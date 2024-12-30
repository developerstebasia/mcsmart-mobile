/**
 * Axios Request Wrapper
 * ---------------------
 *
 * @author  Sheharyar Naseer (@sheharyarn)
 * @license MIT
 *
 */

import axios from 'axios';
import {userCredentialSelector} from '../../store/defaultState/selector';
import {API_URL} from '../static';
import store from '../../store/configure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Request Wrapper with default success/error actions
 */
const request = async options => {
  /**
   * Create an Axios Client with defaults
   */
  const requestHeaders = options.customHeaders || {
    'Content-type': 'application/json',
    Accept: 'application/json',
    'cache-control': 'no-cache',
    'Accept-Encoding': 'gzip',
  };

  /*
   * Put authorization condition like below
   */
  const appState = store.getState();
  const userCredential = userCredentialSelector(appState);
  // const userCredential = null;
  let tokenParam = {};
  const data = await AsyncStorage.getItem('auth')
  
  // console.log('Check userCredential', userCredential);
  if (userCredential) {
    tokenParam = {
      Authorization: `Bearer ${userCredential.token}`,
    };
  }
  
  const client = axios.create({
    baseURL: options.MAIN_URL || API_URL,
    headers: {...requestHeaders, ...tokenParam,},
  });
 
  const onSuccess = response => response.data;

  const onError = error => {
    // console.log('Error Message:', error);
    if (error.response) {
      if (options.handles && error.response.status) {
        if (options.handles.includes(error.response.status)) {
          return Promise.reject(error.response);
        }
      }
      if (error.response.status === 422) {
        // handle 422
      }
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.log('Error Message:', error);
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
