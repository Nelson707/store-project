import api from "./axios";

export const createSale = async (sale) => {
    const res = await api.post("/sales", sale);
    return res.data;
};

export const getSales = async () => {
    const res = await api.get("/getSales");
    return res.data;
};


