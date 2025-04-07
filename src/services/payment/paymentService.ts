import { clientAxiosInstance } from "@/api/client.axios";
import { Booking } from "@/types/User";

export type Purpose = "vendor-booking" | "role-upgrade" | "ticket-purchase";

export interface PaymentResponse {
  success: true;
  clientSecret: string;
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
      amount: data.amount,
      purpose: data.purpose,
      bookingData: data.bookingData,
      createrType: data.createrType,
      receiverType: data.receiverType,
    }
  );
  return response.data;
};
