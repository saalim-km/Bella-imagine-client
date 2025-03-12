import { adminAxiosInstance } from "@/api/admin.axios";

const AdminService = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    try {
      const response = await adminAxiosInstance.get(url, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(`API GET request failed: ${error.message}`);
    }
  },


  post: async <T>(url: string, data: any): Promise<T> => {
    try {
      const response = await adminAxiosInstance.post(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(`API POST request failed: ${error.message}`);
    }
  },

  put: async <T>(url: string, data: any): Promise<T> => {
    try {
      const response = await adminAxiosInstance.put(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(`API PUT request failed: ${error.message}`);
    }
  },
 
  patch: async <T>(url: string, data: any): Promise<T> => {
    try {
      const response = await adminAxiosInstance.patch(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(`API PATCH request failed: ${error.message}`);
    }
  },
  
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await adminAxiosInstance.delete(url);
      return response.data;
    } catch (error: any) {
      throw new Error(`API DELETE request failed: ${error.message}`);
    }
  },
};

export default AdminService;
