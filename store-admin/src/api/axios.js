import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * RESPONSE INTERCEPTOR
 * This runs for EVERY response (success or error)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / server down
    if (!error.response) {
      toast.error("Server unreachable. Please try again later.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Validation errors (Spring @Valid)
    if (status === 400 && data) {
      if (typeof data === "string") {
        toast.error(data);
      } else if (data.message) {
        toast.error(data.message);
      } else {
        Object.values(data).forEach((msg) => toast.error(msg));
      }
    }

    // Not found
    if (status === 404) {
      toast.error("Resource not found");
    }

    // Conflict (e.g. duplicate category)
    if (status === 409) {
      toast.error(data?.message || "Duplicate entry");
    }

    // Unauthorized / forbidden
    // if (status === 401 || status === 403) {
    //   toast.error("You are not authorized to perform this action");
    // }

    // Fallback
    if (status >= 500) {
      toast.error("Internal server error");
    }

    return Promise.reject(error);
  }
);

export default api;
