import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { AxiosResponse } from "../auth/useOtpVerify";
import { BookingQueryParams } from "@/services/booking/bookingService";
import { BasePaginatedResponse } from "@/services/client/clientService";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { BookingList } from "@/pages/User/ClientBookingListing";
interface FetchBookingsParams {
  page: number;
  limit: number;
  sort: string;
  search: string;
  statusFilter: string;
}

type BookingResponse = {
  bookings: BookingList[];
  totalPages: number;
  currentPage: number;
};

export const useBookingQuery = (
  queryFunc: (params: BookingQueryParams) => Promise<BasePaginatedResponse<PaginatedResponse<BookingList>>>,
  params: BookingQueryParams,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["paginated-booking", params],
    queryFn: () => queryFunc(params),
    placeholderData: keepPreviousData,
    enabled,
  });
};

export const useAdminBookingQuery = (
  queryFunc: (params: FetchBookingsParams) => Promise<BookingResponse>,
  page: number,
  limit: number,
  sort: string,
  search: string,
  statusFilter: string
) => {
  return useQuery({
    queryKey: ["admin-paginated-booking", page, limit, sort, search, statusFilter],
    queryFn: () => queryFunc({ page, limit, sort, search, statusFilter }),
  });
};

export const useBookingStatusMutation = (
  mutationFunc: (data: {
    bookingId: any;
    status: string;
  }) => Promise<AxiosResponse>
) => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, Error, { bookingId: any; status: string }>({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginated-booking"] });
    },
  });
};