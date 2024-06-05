import axios from 'axios';

// Set your backend base URL
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
