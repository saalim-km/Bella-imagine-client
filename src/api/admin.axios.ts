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
          await adminAxiosInstance.post('/refresh-token');
          isRefreshing = false;

          return adminAxiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;

          toast.info("Please login again");
          localStorage.removeItem("adminSession");
          window.location.href = "/admin/login";
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);