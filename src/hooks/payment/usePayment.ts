import { makePaymentAndBooking } from "@/services/payment/paymentService";
import { useMutation } from "@tanstack/react-query";

export const useVendorBookingPaymentMutation = () => {
  return useMutation({
    mutationFn: makePaymentAndBooking
  });
};
