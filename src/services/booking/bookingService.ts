import { adminAxiosInstance } from "@/api/admin.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { AxiosResponse } from "@/hooks/auth/useOtpVerify";
import { BasePaginatedResponse } from "../client/clientService";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { BookingList } from "@/pages/User/ClientBookingListing";



export interface BookingQueryParams {
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  statusFilter?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  [key: string]: string | number | undefined;
}


export const getClientBookings = async (params: BookingQueryParams): Promise<BasePaginatedResponse<PaginatedResponse<BookingList>>> => {
  const response = await clientAxiosInstance.get("/client/client-bookings", {
    params: {
      ...params,
    },
  });
  return response.data;
};

export const getClientBookingsInAdmin = async (data: {
  page: number;
  limit: number;
  sort: string;
  search: string;
  statusFilter?: string;
}) => {
  const response = await adminAxiosInstance.get(
    "/admin/client-bookings",
    {
      params: {
        page: data.page,
        limit: data.limit,
        sort: data.sort,
        search: data.search,
        statusFilter: data.statusFilter,
      },
    }
  );
  return response.data;
};


export const getVendorBookings = async (
  params: BookingQueryParams
): Promise<BasePaginatedResponse<PaginatedResponse<BookingList>>> => {
  const response = await vendorAxiosInstance.get("/vendor/vendor-bookings", {
    params: {
      ...params,
    },
  });
  return response.data;
};


export const clientUpdateBookingStatus = async ({
  bookingId,
  status,
}: {
  bookingId: any;
  status: string;
}) : Promise<AxiosResponse> => {
  const response = await clientAxiosInstance.patch(
    "/client/client-bookings",
    {},
    {
      params: {
        bookingId,
        status,
      },
    }
  );
  return response.data;
};

export const vendorUpdateBookingStatus = async ({
  bookingId,
  status,
}: {
  bookingId: any;
  status: string;
}) => {
  const response = await vendorAxiosInstance.patch(
    "/vendor/vendor-bookings",
    {},
    {
      params: {
        bookingId,
        status,
      },
    }
  );
  return response.data;
};
