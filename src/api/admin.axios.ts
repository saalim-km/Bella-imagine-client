import axios from "axios";
import { toast } from "sonner";
import { ENDPOINTS } from "./endpoints";

export const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URI,
  withCredentials: true,
});

let isRefreshing = false;

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('access token expire triggered');
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await adminAxiosInstance.post(ENDPOINTS.ADMIN_REFRESH_TOKEN);
          isRefreshing = false;

          return adminAxiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;

          toast.info("Please login again");
          localStorage.removeItem("adminSession");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }
    }

    if (
      (error.response.status === 403 &&
        error.response.data.message ===
          "Access denied. You do not have permission to access this resource.") ||
      (error.response.status === 403 &&
        error.response.data.message === "Token is blacklisted") ||
      (error.response.status === 403 &&
        error.response.data.message ===
          "Access denied: Your account has been blocked" &&
        !originalRequest._retry)
    ) {
      localStorage.removeItem("adminSession");
      window.location.href = "/";
      toast.info("Please login again");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);