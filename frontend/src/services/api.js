import axios from "axios";

const API = axios.create({
  baseURL: "https://to-do-app-tikg.onrender.com", // tvoj backend link
});

// automatski dodaj token ako postoji
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
