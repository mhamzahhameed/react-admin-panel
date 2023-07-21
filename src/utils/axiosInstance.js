import axios from 'axios';
import store from '../store.js';

function updateAxiosAuthorizationHeader(token) {
  if (token) {
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete AxiosInstance.defaults.headers.common['Authorization'];
  }
}

store.subscribe(() => {
  const newToken = store.getState().token;
  let token = '';
  if (newToken !== null) {
    token = newToken;
    updateAxiosAuthorizationHeader(token);
  } else {
    token = localStorage.getItem('token');
    updateAxiosAuthorizationHeader(token);
  }
});

const AxiosInstance = axios.create({
  baseURL: 'https://api.sehrapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

const initialToken = localStorage.getItem('token');
updateAxiosAuthorizationHeader(initialToken);

export default AxiosInstance;
