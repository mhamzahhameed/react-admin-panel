import axios from 'axios';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iis5MjMwNzg0ODg5MDMiLCJzdWIiOjEsImlhdCI6MTY4NzI0NTE4NiwiZXhwIjoxNjg3MzMxNTg2fQ.vEPdC6fJxSHNYs8KyaP7JAJjIRSwsTftvtkT7qFjS5s';
const AxiosInstance = axios.create({
    baseURL: 'http://3.133.0.29', 
    timeout: 5000, 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export default AxiosInstance