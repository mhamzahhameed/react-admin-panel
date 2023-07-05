import axios from 'axios';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjAzMDEzMzMyMjIxIiwic3ViIjoxLCJpYXQiOjE2ODg1ODI0MDksImV4cCI6MTY4ODY2ODgwOX0.RRkVy1a8l-c5ndxObZ2kxalIWz27daML-vGx8T2tC5Y';
const AxiosInstance = axios.create({
    baseURL: 'https://api.sehrapp.com', 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export default AxiosInstance