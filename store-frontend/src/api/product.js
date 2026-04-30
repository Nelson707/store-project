import api from "./axios";

const ProductService = {
  getAll: async () => {
    const res = await api.get("/products");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  viewProduct: async (id) => {
    const res = await api.post(`/products/${id}/view`);
    return res.data;
  }
};

export default ProductService;