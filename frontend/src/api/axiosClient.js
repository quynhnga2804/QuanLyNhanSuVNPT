import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Gắn token tự động nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
},
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
