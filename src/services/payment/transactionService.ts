import { adminAxiosInstance } from "@/api/admin.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { PopulatedPaymentsResponse } from "@/types/interfaces/Payment";

export const getAllTransactionsByClientId =
  async (): Promise<PopulatedPaymentsResponse> => {
    const response = await clientAxiosInstance.get("/client/transactions");
    return response.data;
  };

export const getAllTransactionsByVendorId =
  async (): Promise<PopulatedPaymentsResponse> => {
    const response = await vendorAxiosInstance.get("/vendor/transactions");
    return response.data;
  };

export const getAllTransactionsByAdminId =
  async (): Promise<PopulatedPaymentsResponse> => {
    const response = await adminAxiosInstance.get("/transactions");
    return response.data;
  };
