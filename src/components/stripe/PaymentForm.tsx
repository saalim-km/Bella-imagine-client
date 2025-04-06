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

// Load Stripe with your public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 

interface PaymentWrapperProps {
  amount: number;
  setIsSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentWrapperProps> = ({
  amount,
  setIsSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet.");
      return;
    }

    setLoading(true);
    try {
      const clientSecret = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      }).then((res) => res.json());

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found.");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Payment failed.");
      }

      if (paymentIntent?.status === "succeeded") {
        setIsSuccess();
      } else {
        throw new Error("Payment not successful.");
      }
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Complete Your Payment</h2>
      <div className="border p-4 rounded-md">
        <CardElement
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
      <Button onClick={handlePayment} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-400">
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
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