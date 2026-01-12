import api from "./axios";

// ============================
// GET ALL PRODUCTS
// ============================
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

// ============================
// GET PRODUCT BY ID (for edit)
// ============================
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// ============================
// CREATE PRODUCT
// ============================
// export const createProduct = async (formData) => {
//   const res = await api.post("/products", formData);
//   return res.data;
// };
// In your api/products.js file
export const createProduct = async (formData) => {
  const res = await api.post("/products", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// ============================
// UPDATE PRODUCT
// ============================
export const updateProduct = async (id, formData) => {
  const res = await api.put(`/products/${id}`, formData);
  return res.data;
};

// ============================
// DELETE PRODUCT
// ============================
export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};
