import { AxiosResponse } from "../auth/useOtpVerify";
import {
  ICreateReview,
  ReviewsResponse,
} from "@/services/review/reviewService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useReviewMutation = (
  mutationFunc: (data: ICreateReview) => Promise<AxiosResponse>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginated-reviews"] });
    },
  });
};

export const useReviewsQuery = (
  queryFunc: (data: {
    page: number;
    limit: number;
    sort: string;
    vendorId: string;
  }) => Promise<ReviewsResponse>,
  page: number,
  limit: number,
  sort: string,
  vendorId: string
) => {
  return useQuery({
    queryKey: ["paginated-reviews", page, limit, sort, vendorId],
    queryFn: () => queryFunc({ limit, page, sort, vendorId }),
  });
};
