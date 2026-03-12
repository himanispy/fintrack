import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fintrack_token');
      localStorage.removeItem('fintrack_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const fetchExpenses = (params) => API.get('/expenses', { params });
export const addExpenseAPI = (data) => API.post('/expenses', data);
export const deleteExpenseAPI = (id) => API.delete(`/expenses/${id}`);
export const fetchAnalytics = () => API.get('/expenses/analytics/summary');
export const fetchBudget = () => API.get('/budget');
export const saveBudget = (amount) => API.post('/budget', { amount });

export default API;
