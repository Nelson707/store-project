import api from "./axios";

const normalizeSalesResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.sales) return data.sales;
  return [];
};

const SalesService = {
  getAll: async () => {
    const res = await api.get("/sales");
    return normalizeSalesResponse(res.data);
  },

  getToday: async () => {
    const res = await api.get("/sales/today");
    return normalizeSalesResponse(res.data);
  },

  getWeek: async () => {
    const res = await api.get("/sales/week");
    return normalizeSalesResponse(res.data);
  },

  getMonth: async () => {
    const res = await api.get("/sales/month");
    return normalizeSalesResponse(res.data);
  },

  getByRange: async (startDate, endDate) => {
    const res = await api.get(`/sales/range?start=${startDate}&end=${endDate}`);
    return normalizeSalesResponse(res.data);
  },

  /**
   * Smart fetch (handles your current logic)
   */
  getByFilter: async (filter, customRange) => {
    try {
      switch (filter) {
        case "today":
          return await SalesService.getToday();
        case "week":
          return await SalesService.getWeek();
        case "month":
          return await SalesService.getMonth();
        case "custom":
          if (customRange?.startDate && customRange?.endDate) {
            return await SalesService.getByRange(
              customRange.startDate,
              customRange.endDate
            );
          }
          return [];
        case "All":
        default:
          return await SalesService.getAll();
      }
    } catch (error) {
      console.error("Primary sales fetch failed:", error);

      // fallback
      try {
        return await SalesService.getAll();
      } catch (fallbackError) {
        console.error("Fallback sales fetch failed:", fallbackError);
        throw fallbackError;
      }
    }
  }
};

export default SalesService;