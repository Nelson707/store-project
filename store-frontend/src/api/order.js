import api from "./axios";

const OrderService = {
    getAll: async () => {
        const res = await api.get("/orders");
        return res.data;
    },

    cancelOrder: async () => {
        const res = await api.post("/orders", payload);
        return res.data;
    },

    cancelOrder: async () => {
        const res = await api.patch(`/orders/${orderId}/cancel`);
        return res.data;
    }
}

export default OrderService;