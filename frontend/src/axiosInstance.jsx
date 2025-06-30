// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8020/api/',
  timeout: 10000, 
});

// Har bir so‘rovga avtomatik token qo‘shish
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// (ixtiyoriy) token muddati tugagan bo‘lsa logout qilish yoki xabar berish
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.warn('Token tugagan yoki noto‘g‘ri. Iltimos, qayta kiring.');
      // localStorage.clear(); // yoki logout() chaqiring
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
