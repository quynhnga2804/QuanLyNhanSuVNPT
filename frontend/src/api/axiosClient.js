import axios from 'axios';
import { message } from 'antd';

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

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      message.error('Phiên đăng nhập đã hết hạn!');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
