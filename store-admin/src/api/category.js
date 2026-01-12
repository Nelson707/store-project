import api from "./axios";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (category) => {
  const response = await api.post("/categories", category);
  return response.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
};
