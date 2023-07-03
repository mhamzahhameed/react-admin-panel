import axios from 'axios';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjAzMDEzMzMyMjIxIiwic3ViIjoxLCJpYXQiOjE2ODgzODQwMTEsImV4cCI6MTY4ODQ3MDQxMX0.4W_naTWSLfLesgNjKevx95W4Ux-47mslsyXAYlkP43A';
const AxiosInstance = axios.create({
    baseURL: 'https://api.sehrapp.com', 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export default AxiosInstance