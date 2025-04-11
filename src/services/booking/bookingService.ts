import { adminAxiosInstance } from "@/api/admin.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { AxiosResponse } from "@/hooks/auth/useOtpVerify";

export const getClientBookings = async (data: {
  page: number;
  limit: number;
  sort: string;
  search: string;
  statusFilter: string;
}) => {
  const response = await clientAxiosInstance.get(
    "/client/client-bookings",
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

export const getVendorBookings = async (data: {
  page: number;
  limit: number;
  sort: string;
  search: string;
  statusFilter: string;
}) => {
  const response = await vendorAxiosInstance.get(
    "/vendor/vendor-bookings",
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

export const clientUpdateBookingStatus = async ({
  bookingId,
  status,
}: {
  bookingId: any;
  status: string;
}) : Promise<AxiosResponse> => {
  const response = await clientAxiosInstance.patch(
    "/client/booking/status",
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
    "/vendor/booking/status",
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
