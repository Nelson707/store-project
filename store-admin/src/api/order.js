import api from "./axios";

const OrderService ={
    getAdminOrders: async () => {
        const res = await api.get("/admin/orders");
        return res.data || [];
    }
}

export default OrderService;