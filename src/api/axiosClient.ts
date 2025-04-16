import axios from 'axios';
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosClient.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default axiosClient;
