import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'https://api.sehrapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

function getToken() {
  return localStorage.getItem('token');
}

function updateAxiosAuthorizationHeader() {
  const token = getToken();
  if (token) {
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete AxiosInstance.defaults.headers.common['Authorization'];
  }
}

// Initial setup
updateAxiosAuthorizationHeader();

// Listen for changes in localStorage across different tabs/windows
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    updateAxiosAuthorizationHeader();
  }
});

export default AxiosInstance;
