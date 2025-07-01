import axios from "axios";
import { toast } from "sonner";
import { ENDPOINTS } from "./endpoints";

export const clientAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_CLIENT_API_URI,
  withCredentials: true,
});

let isRefreshing = false;

clientAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('access token expire triggered');
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await clientAxiosInstance.post(ENDPOINTS.CLIENT_REFRESH_TOKEN);
          isRefreshing = false;
          
          return clientAxiosInstance(originalRequest);
        } catch (refreshError) {  
          isRefreshing = false;

          toast.info("Please login again");
          localStorage.removeItem("clientSession");
          // window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }
    }

    if (
      (error.response.status === 403 && error.response.data.message === "Access denied: Your account has been blocked")){
      localStorage.removeItem("clientSession");
      // window.location.href = "/";
      toast.info(error.response.data.message);
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
