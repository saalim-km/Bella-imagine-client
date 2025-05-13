import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Booking } from "@/types/User";
import { useVendorBookingPaymentMutation } from "@/hooks/payment/usePayment";
import { clientAxiosInstance } from "@/api/client.axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentWrapperProps {
  amount: number;
  setIsSuccess: () => void;
  bookingData: Booking;
  onError: (error: string) => void;
  onPaymentStart: () => void;
  disabled?: boolean;
}

const PaymentForm: React.FC<PaymentWrapperProps> = ({
  amount,
  setIsSuccess,
  onError,
  bookingData,
  onPaymentStart,
  disabled = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { mutate: proceedPayment } = useVendorBookingPaymentMutation();

  async function handlePayment() {
    setLoading(true);
    onPaymentStart();

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)!,
    });

    if (error) {
      toast.error(error.message || "An error occurred while creating payment method");
      setLoading(false);
      return;
    }

    proceedPayment(
      {
        amount,
        purpose: "vendor-booking",
        bookingData: bookingData,
        createrType: "Client",
        receiverType: "Vendor",
      },
      {
        onSuccess: async (data) => {
          setLoading(false);
          const { error: stripeError, paymentIntent } =
            await stripe.confirmCardPayment(data.clientSecret, {
              payment_method: {
                card: elements.getElement(CardElement)!,
              },
            });
          if (stripeError) {
            toast.error(stripeError.message || "An error occurred");
          } else if (paymentIntent.status === "succeeded") {
            try {
              await clientAxiosInstance.post("/client/confirm-payment", {
                paymentIntentId: paymentIntent.id,
              });
              setIsSuccess();
              toast.success("Payment completed.");
            } catch (error) {
              console.error("Error in confirm payment =>", error);
            }
          }
        },
        onError: (error: any) => {
          setLoading(false);
          toast.error(error.response?.data?.message || "Payment failed.");
        },
      }
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Complete Your Payment</h2>
      <div className="border p-4 rounded-md">
        <CardElement
          onChange={(event) => setCardComplete(event.complete)}
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <Button
        onClick={handlePayment}
        disabled={loading || disabled || !cardComplete}
        className="w-full bg-blue-600 hover:bg-blue-400"
      >
        {loading ? "Processing..." : `Pay ₹ ${amount.toFixed(2)}`}
      </Button>
    </div>
  );
};

export const PaymentWrapper: React.FC<PaymentWrapperProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};
