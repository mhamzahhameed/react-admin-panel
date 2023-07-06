import axios from 'axios';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjAzMDEzMzMyMjIxIiwic3ViIjoxLCJpYXQiOjE2ODg2MjQ1ODAsImV4cCI6MTY4ODcxMDk4MH0._1vet6e3VvXeY_awLxvlJ3fmWUxy9RhoPCJ4JskFOuE';
const AxiosInstance = axios.create({
    baseURL: 'https://api.sehrapp.com', 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export default AxiosInstance