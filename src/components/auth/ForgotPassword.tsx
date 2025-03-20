import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { OTPVerificationModal } from "../modals/ForgotPassOtpModal"
import { useThemeConstants } from "@/utils/theme/themeUtills"
import { TRole } from "@/types/User"
import { useSendOtp } from "@/hooks/auth/useSendOtp"
import { toast } from "sonner"
import { handleError } from "@/utils/Error/errorHandler"
import { useNavigate } from "react-router-dom"


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type FormValues = z.infer<typeof formSchema>

interface ForgotPasswordProps {
  userType: TRole
}

export function ForgotPassword({ userType }: ForgotPasswordProps) {
  const navigate = useNavigate()
  const {mutate : sendOtp} =  useSendOtp()
  const {bgColor} = useThemeConstants()
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSendig,setIsSending] = useState(false)

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    setIsSending(true)
    setEmail(data.email)

    sendOtp({url:'/forgot-password/send-otp',email : data.email,userType : userType},{
        onSuccess : (data)=> {
            setIsSending(false)
            toast.success(data.message)
            setIsOTPModalOpen(true)
        },
        onError : (err)=> {
            setIsSending(false)
            handleError(err)
        }
    })

  }

  return (
    <div className={`w-full max-w-md mx-auto mt-40`}>
      <Card className={`bg-${bgColor}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a code to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
                        <Mail className="ml-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="name@example.com"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSendig}>
                {isSendig ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate('/login')}>
            Back to login
          </Button>
        </CardFooter>
      </Card>

      <OTPVerificationModal
        isOpen={isOTPModalOpen}
        email={email}
        userType={userType}
      />
    </div>
  )
}

