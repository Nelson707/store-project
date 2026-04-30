import api from "./axios";

const UserService = {
  // Admin users
  getAdminUsers: async () => {
    const res = await api.get("/auth/users/admins");
    return res.data.admins || [];
  },

  // Regular users
  getRegularUsers: async () => {
    const res = await api.get("/auth/users/regular");
    return res.data.users || [];
  },

  // Current user
  getCurrentUser: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  // All users
  getAllUsers: async () => {
    const res = await api.get("/auth/users");
    return res.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/auth/users/${id}`);
    return res.data;
  },

  // ✅ UPDATE USER (missing)
  updateUser: async (id, payload) => {
    const res = await api.put(`/auth/users/${id}`, payload);
    return res.data;
  },

  // ✅ TOGGLE ENABLED (missing)
  toggleUserEnabled: async (id) => {
    const res = await api.put(`/auth/users/${id}/toggle-enabled`);
    return res.data; // contains { enabled, message }
  },

  // ✅ CREATE ADMIN (missing)
  createAdmin: async (payload) => {
    const res = await api.post("/auth/users/create-admin", payload);
    return res.data;
  },

  // Delete user
  deleteUser: async (id) => {
    await api.delete(`/auth/users/${id}`);
  },

  // Role update (if needed separately)
  updateUserRole: async (id, role) => {
    const res = await api.put(`/auth/users/${id}/role`, { role });
    return res.data;
  }
};

export default UserService;