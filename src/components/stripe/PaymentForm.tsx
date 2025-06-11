"use client"

import type React from "react"
import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import type { Booking } from "@/types/interfaces/User"
import { useVendorBookingPaymentMutation } from "@/hooks/payment/usePayment"
import { clientAxiosInstance } from "@/api/client.axios"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

interface PaymentWrapperProps {
  toatlAmount : number
  setIsSuccess: () => void
  bookingData: Booking
  onError: (error: string) => void
  onPaymentStart: () => boolean
  disabled?: boolean
}

const PaymentForm: React.FC<PaymentWrapperProps> = ({
  toatlAmount,
  setIsSuccess,
  onError,
  bookingData,
  onPaymentStart,
  disabled = false,
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [isPaymentValid, setIsPaymentValid] = useState(false)
  const { mutate: proceedPayment } = useVendorBookingPaymentMutation()

  const handlePayment = async () => {
    if (!stripe || !elements) return

    if (!onPaymentStart()) {
      return
    }

    setLoading(true)

    try {
      proceedPayment(
        {
          amount : toatlAmount,
          purpose: "vendor-booking",
          bookingData,
          createrType: "Client",
          receiverType: "Vendor",
        },
        {
          onSuccess: async (data) => {
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
              elements,
              clientSecret: data.clientSecret,
              confirmParams: {
                return_url: window.location.origin,
              },
              redirect: "if_required",
            })

            if (stripeError) {
              toast.error(stripeError.message || "Payment failed")
              setLoading(false)
              onError(stripeError.message || "Payment failed")
            } else if (paymentIntent?.status === "succeeded") {
              try {
                await clientAxiosInstance.post("/client/confirm-payment", {
                  paymentIntentId: paymentIntent.id,
                  bookingData,
                })
                setIsSuccess()
                toast.success("Payment completed", {
                  description: "Your payment has been successfully completed.",
                })
              } catch (error) {
                console.error("Error in confirm payment:", error)
                onError("Failed to confirm payment")
              }
            }
            setLoading(false)
          },
          onError: (error: any) => {
            setLoading(false)
            toast.error(error.response?.data?.message || "Payment failed.")
            onError(error.response?.data?.message || "Payment failed.")
          },
        }
      )
    } catch (error) {
      setLoading(false)
      toast.error("An unexpected error occurred")
      onError("An unexpected error occurred")
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "apple_pay", "google_pay"],
          }}
          onChange={(event) => {
            // Update isPaymentValid based on whether the payment method is complete
            setIsPaymentValid(event.complete)
          }}
        />

        <Button
          onClick={handlePayment}
          disabled={loading || disabled || !stripe || !elements || !isPaymentValid}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </div>
          ) : (
            `Complete Payment - ₹${toatlAmount.toFixed(2)}`
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          🔒 Your payment information is secure and encrypted
        </div>
      </CardContent>
    </Card>
  )
}

export const PaymentWrapper: React.FC<PaymentWrapperProps> = (props) => {
  const stripeOptions = {
    mode: "payment" as const,
    amount: Math.round(props.toatlAmount * 100), // Convert to cents
    currency: "inr",
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#2563eb",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#dc2626",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <PaymentForm {...props} />
    </Elements>
  )
}