import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add user ID to requests if available
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('withme-user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      config.params = config.params || {};
      config.params.userId = userData.userId;
    } catch (err) {
      console.error('Failed to add userId to request:', err);
    }
  }
  return config;
});

export default api;
