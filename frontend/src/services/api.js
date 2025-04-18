const API_BASE = "https://to-do-app-tikg.onrender.com"; // 👈 tvoj backend link

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export default API_BASE;
