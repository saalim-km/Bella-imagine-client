import { adminAxiosInstance } from "@/api/admin.axios";

const AdminService = {
  get: async <T>(url: string, params?: any): Promise<T> => {
      const response = await adminAxiosInstance.get(url, { params });
      console.log(response);
      return response.data;
  },


  post: async <T>(url: string, data: any): Promise<T> => {
      const response = await adminAxiosInstance.post(url, data);
      return response.data;
  },

  put: async <T>(url: string, data: any): Promise<T> => {
      const response = await adminAxiosInstance.put(url, data);
      return response.data;
  },
 
  patch: async <T>(url: string, data: any): Promise<T> => {
      const response = await adminAxiosInstance.patch(url,{},{
        params : {
          role : data.role,
          id : data.id,
          isblocked : data.isblock
        }
      });
      return response.data;
  },
  
  delete: async <T>(url: string): Promise<T> => {
    const response = await adminAxiosInstance.delete(url);
    return response.data;
  },

};

export default AdminService;


export const updateVendorRequestService = async(params : {reason ?: string , id : string,status : any})=> {
  const response = await adminAxiosInstance.patch('/vendor-request',{},{
    params : params
  })
  return response.data;
}