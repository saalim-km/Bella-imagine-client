import { adminAxiosInstance } from "@/api/admin.axios";
import { BasePaginatedResponse } from "../client/clientService";



export interface DashboardData {
  totalClients: number
  totalVendors: number
  totalBookings: number
  totalPosts: number
  bookingTrends: Array<{ month: string; count: number }>
  topPhotographers: Array<{ vendorId: string; name: string; profileImage?: string; bookingCount: number }>
  newUsersTrend: Array<{ month: string; count: number }>
  recentUsers: Array<{
    _id: string
    name: string
    email: string
    profileImage?: string
    createdAt: string
    role: string
  }>
  recentBookings: Array<{
    _id: string
    serviceDetails: { serviceTitle: string }
    totalPrice: number
    status: string
    paymentStatus: string
    createdAt: string
    userId: { name: string }
    vendorId: { name: string }
  }>
  recentPosts: Array<{
    _id: string
    title: string
    content: string
    mediaType: string
    likeCount: number
    commentCount: number
    createdAt: string
    userId: { name: string; profileImage?: string }
    communityId: { name: string }
    userType: string
  }>
  postDistribution: Array<{ mediaType: string; count: number }>
}

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

export const getDashBoardStatsService = async(): Promise<BasePaginatedResponse<DashboardData>> => {
  const response = await adminAxiosInstance.get('/dashboard')
  return response.data
}