// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5175',
  withCredentials: true,
});

export default API;
