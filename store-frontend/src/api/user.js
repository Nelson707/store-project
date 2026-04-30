import api from "./axios";

const UserService = {
  getCurrentUser: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/auth/users/${id}`);
    return res.data;
  },

  updateUser: async (payload) => {
    const res = await api.put(`/auth/me/update`, payload);
    return res.data;
  },

  updatePassword: async (payload) => {
    const res = await api.put(`/auth/me/change-password`, payload);
    return res.data;
  }
};

export default UserService;