import axios from "axios";
import { toast } from "sonner";
import { ENDPOINTS } from "./endpoints";

export const vendorAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_VENDOR_API_URI,
  withCredentials: true,
});

let isRefreshing = false;

vendorAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('access token expire triggered');
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await vendorAxiosInstance.post(ENDPOINTS.VENDOR_REFRESH_TOKEN);
          isRefreshing = false;

          return vendorAxiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;

          toast.info("Please login again");
          localStorage.removeItem("vendorSession");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }
    }

    if (
      (error.response.status === 403 &&
        error.response.data.message ===
          "Access denied: Your account has been blocked" &&
        !originalRequest._retry)
    ) {
      localStorage.removeItem("vendorSession");
      window.location.href = "/";
      toast.info("Please login again");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);