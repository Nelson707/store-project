import api from "./axios";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await api.post("/products", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};


export const updateProduct = async (id, formData) => {
  const res = await api.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};


export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};
