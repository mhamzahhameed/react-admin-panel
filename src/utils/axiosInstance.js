import axios from 'axios';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iis5MjMwNzg0ODg5MDMiLCJzdWIiOjEsImlhdCI6MTY4NzMzNjU4MiwiZXhwIjoxNjg3NDIyOTgyfQ.kFALbrLHQPkMvcex1wjCEpSvNyOHoOEAVOhBNyjKjfY";
const AxiosInstance = axios.create({
    baseURL: 'http://3.133.0.29', 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export default AxiosInstance