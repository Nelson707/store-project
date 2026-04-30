import api from "./axios";

const AuthService = {
  register: async (form) => {
    const res = await api.post("/auth/register", form);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  saveUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getStoredUser: () => {
    return JSON.parse(localStorage.getItem("user") || "null");
  },

  clearUser: () => {
    localStorage.removeItem("user");
  }
};

export default AuthService;