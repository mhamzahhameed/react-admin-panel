import axios from 'axios';
import store from '../store.js';

const AxiosInstance = axios.create({
  baseURL: 'https://api.sehrapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

let token = store.getState().token;
if (!token) {
  token = localStorage.getItem('token');
}

updateAxiosAuthorizationHeader(token);

store.subscribe(() => {
  const newToken = store.getState().token;
  if (newToken !== token) {
    token = newToken;
    updateAxiosAuthorizationHeader(token);
  }
});

function updateAxiosAuthorizationHeader(token) {
  if (token) {
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete AxiosInstance.defaults.headers.common['Authorization'];
  }
}



export default AxiosInstance;
