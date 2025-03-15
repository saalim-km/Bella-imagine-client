import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  onClose: () => void
  email: string
  userType: TRole
}

export function OTPVerificationModal({ isOpen, onClose, email, userType }: OTPVerificationModalProps) {
    const {mutate : resendOtp} = useSendOtp()
    const {mutate : verifyOtp} = useOtpVerifyMutataion()
  const {bgColor} = useThemeConstants()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  })


  const onSubmit = (data: FormValues) => {
    setIsVerifying(true)
    verifyOtp({email,otp : data.otp} , {
        onSuccess : (data)=> {
            console.log(data.message);
            toast.success(data.message)
            setIsVerified(true)
            setIsVerifying(false)
            setShowPasswordForm(true)
        },
        onError : (error)=> {
            setIsVerifying(false)
            handleError(error)
        }
    })
  }


  const handleResendOTP = () => {
    resendOtp({url : '/send-otp',email : email},{
        onSuccess : (data)=> {
            toast.success(data.message)
        },onError : (error)=> {
            handleError(error)
        }
    })
  }


  const handlePasswordResetComplete = () => {
    setShowPasswordForm(false)
    setResetComplete(true)


    setTimeout(() => {
      onClose()
      // Reset state for next time
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          // Reset state when closing
          setIsVerified(false)
          setShowPasswordForm(false)
          setResetComplete(false)
        }
      }}
    >
    <DialogContent className={`sm:max-w-md`}>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

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

              <DialogFooter className="flex-col sm:flex-col gap-2">
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
                <Button type="button" variant="link" onClick={handleResendOTP} disabled={isVerifying}>
                  Didn't receive a code? Resend
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}