import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { NewPasswordForm } from "../auth/NewPasswordForm"
import { useThemeConstants } from "@/utils/theme/themeUtills"
import { TRole } from "@/types/User"
import { useOtpVerifyMutataion } from "@/hooks/auth/useOtpVerify"
import { toast } from "sonner"
import { useSendOtp } from "@/hooks/auth/useSendOtp"
import { handleError } from "@/utils/Error/errorHandler"

const formSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 digits" }),
})

type FormValues = z.infer<typeof formSchema>

interface OTPVerificationModalProps {
  isOpen: boolean
  email: string
  userType: TRole
}

export function OTPVerificationModal({ isOpen, email, userType }: OTPVerificationModalProps) {
  const { mutate: resendOtp } = useSendOtp()
  const { mutate: verifyOtp } = useOtpVerifyMutataion()
  const { bgColor } = useThemeConstants()
  
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const [timer, setTimer] = useState(60)

  // Start the timer when component mounts (OTP is sent)
  useEffect(() => {
    if (isOpen) startTimer()
  }, [isOpen])

  const startTimer = () => {
    setIsResendDisabled(true)
    setTimer(60)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval)
          setIsResendDisabled(false)
        }
        return prev - 1
      })
    }, 1000)
  }

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit = (data: FormValues) => {
    setIsVerifying(true)
    verifyOtp({ email, otp: data.otp }, {
      onSuccess: (data) => {
        toast.success(data.message)
        setIsVerified(true)
        setIsVerifying(false)
        setShowPasswordForm(true)
      },
      onError: (error) => {
        setIsVerifying(false)
        handleError(error)
      }
    })
  }

  const handleResendOTP = () => {
    resendOtp({ url: '/forgot-password/send-otp', email: email , userType : userType }, {
      onSuccess: (data) => {
        toast.success(data.message)
        startTimer()
      },
      onError: (error) => {
        handleError(error)
      }
    })
  }

  const handlePasswordResetComplete = () => {
    setShowPasswordForm(false)
    setResetComplete(true)

    setTimeout(() => {
      setIsVerified(false)
      setShowPasswordForm(false)
      setResetComplete(false)
    }, 2000)
  }

  const getDialogTitle = () => {
    if (resetComplete) return "Password Reset Complete"
    if (showPasswordForm) return "Create New Password"
    return "Verify your email"
  }

  const getDialogDescription = () => {
    if (resetComplete) return "Your password has been successfully reset."
    if (showPasswordForm) return "Please create a new password for your account."
    return `We've sent a 6-digit code to ${email}. Enter the code below to verify your email.`
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getDialogTitle()}</AlertDialogTitle>
          <AlertDialogDescription>{getDialogDescription()}</AlertDialogDescription>
        </AlertDialogHeader>

        {resetComplete ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-center font-medium">Your password has been reset successfully!</p>
            <p className="text-center text-sm text-muted-foreground">You can now log in with your new password.</p>
          </div>
        ) : showPasswordForm ? (
          <NewPasswordForm onComplete={handlePasswordResetComplete} email={email} userType={userType} />
        ) : isVerified ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-center font-medium">Verification successful!</p>
            <p className="text-center text-sm text-muted-foreground">Proceeding to password reset...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="mx-auto flex justify-center">
                    <FormControl>
                      <InputOTP maxLength={6} value={field.value} onChange={field.onChange} disabled={isVerifying}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex-col sm:flex-col gap-2">
                <Button type="submit" className="w-full" disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
                <Button type="button" variant="link" onClick={handleResendOTP} disabled={isResendDisabled}>
                  {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
