import axios from 'axios';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjAzMDEzMzMyMjIxIiwic3ViIjoxLCJpYXQiOjE2ODc4ODkyMDMsImV4cCI6MTY4Nzk3NTYwM30.8owYvf3l53twsxdLl7WQrVLUowYhDO-4nVCkYIZJFmo';
const AxiosInstance = axios.create({
    baseURL: 'https://api.sehrapp.com', 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export default AxiosInstance