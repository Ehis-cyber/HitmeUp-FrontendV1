import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8800/api", // Replace with your backend URL
  withCredentials: true, // Include cookies for authentication
});

export default api;