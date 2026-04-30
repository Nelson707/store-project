import api from "./axios";

const CategoryService = {
  getAll: async () => {
    const res = await api.get("/categories");
    return res.data;
  }
}

export default CategoryService