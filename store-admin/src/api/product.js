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

  create: async (formData) => {
    const res = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  },

  update: async (id, formData) => {
    const res = await api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/products/${id}`);
  },

  getViews: async (id) => {
    const res = await api.get(`/products/${id}/views`);
    return res.data.views;
  },

  getOrderCount: async (id) => {
    const res = await api.get(`/admin/orders/products/${id}/order-count`);
    return res.data.orderCount;
  },

  getRelated: async (categoryId, currentProductId) => {
    const res = await api.get(`/products?categoryId=${categoryId}&limit=4`);

    // filter here → keeps component clean
    return res.data.filter(p => p.id !== parseInt(currentProductId));
  }
};

export default ProductService;