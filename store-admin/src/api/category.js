import api from "./axios";

const CategoryService = {
  getAll: async () => {
    const res = await api.get("/categories");
    return res.data;
  },
  create: async (category) => {
    const res = await api.post("/categories", category);
    return res.data;
  },
  delete: async (id) => {
    await api.delete(`/categories/${id}`);
  },
}

export default CategoryService