import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";
import { IClient } from "../client/clientService";
import { IVendor } from "../vendor/vendorService";

export interface ICreateReview {
  vendorId: string;
  rating: number;
  comment: string;
  bookingId: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface ServiceDetails {
  serviceTitle: string;
  serviceDescription: string;
  cancellationPolicies: string[];
  termsAndConditions: string[];
}

interface IBookingEntity {
  _id?: string;
  userId?: string;
  vendorId?: string;
  paymentId?: string;
  isClientApproved: boolean;
  isVendorApproved: boolean;
  serviceDetails: ServiceDetails;
  bookingDate: string;
  timeSlot: TimeSlot;
  totalPrice: number;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
}

export interface PopulatedReview {
  bookingId: IBookingEntity;
  reviewId: string;
  clientId: IClient;
  vendorId: IVendor;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewsResponse {
  success: boolean;
  reviews: PopulatedReview[];
  totalPages: number;
  currentPage: number;
}

export const createNewReview = async (data: ICreateReview) => {
  const response = await clientAxiosInstance.post("/_cl/client/review", data);
  return response.data;
};

export const clientGetAllReviewsByVendorId = async (data: {
  page: number;
  limit: number;
  sort: string;
  vendorId: string;
}) => {
  const response = await clientAxiosInstance.get("/_cl/client/reviews", {
    params: {
      page: data.page,
      limit: data.limit,
      sort: data.sort,
      vendorId: data.vendorId,
    },
  });
  return response.data;
};

export const vendorGetAllReviewsByVendorId = async (data: {
  page: number;
  limit: number;
  sort: string;
  vendorId: string;
}) => {
  const response = await vendorAxiosInstance.get("/_ve/vendor/reviews", {
    params: {
      page: data.page,
      limit: data.limit,
      sort: data.sort,
      vendorId: data.vendorId,
    },
  });
  return response.data;
};
