import { makePaymentAndBooking, Purpose } from "@/services/payment/paymentService";
import { Booking } from "@/types/User";
import { useMutation } from "@tanstack/react-query";

export const useVendorBookingPaymentMutation = () => {
  return useMutation({
    mutationFn: makePaymentAndBooking
  });
};
