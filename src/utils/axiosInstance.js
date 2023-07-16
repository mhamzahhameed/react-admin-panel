import axios from 'axios';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjAzMDEzMzMyMjIxIiwic3ViIjoxLCJpYXQiOjE2ODk1MDc4MjgsImV4cCI6MTY4OTU5NDIyOH0.F1GKHJ_CFWbcweebOWC3jaBZkx5MbBYn8kIYRGnzYZM';
const AxiosInstance = axios.create({
    baseURL: 'https://api.sehrapp.com', 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export default AxiosInstance