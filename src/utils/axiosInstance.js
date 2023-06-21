import axios from 'axios';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iis5MjMwNzg0ODg5MDMiLCJzdWIiOjEsImlhdCI6MTY4NzMzMTc4NiwiZXhwIjoxNjg3NDE4MTg2fQ.50-67_IX3AgIPRMmTm7Q2VmtmEsnHy5AmSZg5FkKAC4';
const AxiosInstance = axios.create({
    baseURL: 'http://3.133.0.29', 
    timeout: 5000, 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export default AxiosInstance