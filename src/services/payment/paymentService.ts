import { clientAxiosInstance } from "@/api/client.axios";
import { Booking } from "@/types/interfaces/User";

export type Purpose = "vendor-booking" | "role-upgrade" | "ticket-purchase";

export interface PaymentResponse {
  success: boolean;
  data: string;
  message: string;
}

export const makePaymentAndBooking = async (data: {
  amount: number;
  purpose: Purpose;
  bookingData: Booking;
  createrType: string;
  receiverType: string;
}): Promise<PaymentResponse> => {
  const response = await clientAxiosInstance.post(
    "/client/create-payment-intent",
    {
      ...data.bookingData,
      purpose: data.purpose,
      createrType: data.createrType,
      receiverType: data.receiverType,
    }
  );
  return response.data;
};
