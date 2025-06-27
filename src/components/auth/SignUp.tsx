"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { useNavigate } from "react-router"
import { signupSchema } from "@/utils/formikValidators/auth/signup.validator"
import OTPModal from "@/components/modals/OtpModal"
import GoogleAuth from "./GoogleAuth"
import type { IUser, TRole } from "@/types/interfaces/User"
import { useSendOtp } from "@/hooks/auth/useSendOtp"
import { toast } from "sonner"
import { useOtpVerifyMutataion } from "@/hooks/auth/useOtpVerify"
import { handleError } from "@/utils/Error/error-handler.utils"
import type { CredentialResponse } from "@react-oauth/google"
import { useGoogleLoginMutataion } from "@/hooks/auth/useGoogleLogin"
import { clientLogin } from "@/store/slices/clientSlice"
import { useDispatch } from "react-redux"
import { vendorLogin } from "@/store/slices/vendorSlice"
import { Eye, EyeOff, Camera, Users, Sparkles, Zap, Globe, TrendingUp } from "lucide-react"
import { communityToast } from "../ui/community-toast"

interface SignUpProps {
  onSubmit: (data: IUser) => void
  userType: TRole
  onClick?: () => void
}

export default function CommunitySignup({ onSubmit, userType, onClick }: SignUpProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [userData, setUserData] = useState<IUser>({} as IUser)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { mutate: sendVerificationOTP } = useSendOtp()
  const { mutate: verifyOtp } = useOtpVerifyMutataion()
  const { mutate: googleLogin } = useGoogleLoginMutataion()

  const submitRegister = () => {
    onSubmit(userData)
  }

  function handleOtpSend(user: IUser) {
    setIsSending(true)
    sendVerificationOTP(
      { url: "/send-otp", email: user.email, role: userType },
      {
        onSuccess: (data) => {
                    communityToast.success({title : data?.message});
          
          setUserData(user)
          setIsSending(false)
          setIsOtpModalOpen(true)
          setTimeout(() => setIsOtpModalOpen(true), 0)
        },
        onError: (error) => {
          setIsSending(false)
          handleError(error)
        },
      },
    )
  }

  function handleOtpVerify(otp: string) {
    verifyOtp(
      { email: userData.email, otp },
      {
        onSuccess: (data) => {
          submitRegister()
                    communityToast.success({title : data?.message});

          setIsOtpModalOpen(false)
          navigate("/login")
        },
        onError: (error) => {
          handleError(error)
        },
      },
    )
  }

  function handleGoogle(credentialResponse: CredentialResponse) {
    googleLogin(
      {
        credential: credentialResponse.credential,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        role: userType,
      },
      {
        onSuccess: (data) => {
          console.log("after google register of user : ", data)
                    communityToast.success({title : data?.message , description : ''});

          if (userType === "vendor") {
            dispatch(
              vendorLogin({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                avatar: data.user.avatar,
              }),
            )
          } else {
            dispatch(
              clientLogin({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                avatar: data.user.avatar,
              }),
            )
          }
        },
        onError: (error) => {
          handleError(error)
        },
      },
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 float-animation" />
        <div
          className="absolute bottom-20 right-1/4 w-32 h-32 bg-orange-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/2 left-10 w-24 h-24 bg-blue-100 rounded-full opacity-30 float-animation"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Signup Form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12 bg-white/80 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    userType === "vendor" ? "community-gradient" : "photographer-gradient"
                  }`}
                >
                  {userType === "vendor" ? (
                    <Camera className="w-8 h-8 text-white" />
                  ) : (
                    <Users className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userType === "vendor" ? "Become a Photographer" : "Join Our Community"}
                </h1>
                <p className="text-gray-600 mt-2">
                  {userType === "vendor"
                    ? "Start your photography journey and connect with clients"
                    : "Discover talented photographers for your special moments"}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {userType === "vendor" ? (
                <>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Showcase Work</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Grow Business</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Find Talent</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Easy Booking</span>
                  </div>
                </>
              )}
            </div>

            {/* Signup Form */}
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={signupSchema}
              onSubmit={(values) => {
                const user = {
                  name: values.name,
                  email: values.email,
                  password: values.password,
                  role: userType as TRole,
                }
                handleOtpSend(user)
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Field
                      as={Input}
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white/80"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white/80"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        as={Input}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        className="h-12 pr-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white/80"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        as={Input}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className="h-12 pr-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white/80"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <Button
                    type="submit"
                    className={`w-full h-12 text-white font-medium ${
                      userType === "vendor" ? "community-gradient" : "photographer-gradient"
                    } hover:opacity-90`}
                    disabled={isSending}
                  >
                    {isSending ? "Creating account..." : `Join as ${userType === "vendor" ? "Photographer" : "Client"}`}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Google Auth */}
            <div className="flex justify-center">
              <GoogleAuth handleGoogleSuccess={handleGoogle} />
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                {userType === "client" ? "Want to become a photographer?" : "Looking to hire photographers?"}{" "}
                <button onClick={onClick} className="text-orange-700 hover:text-orange-800 font-medium hover:underline">
                  Switch to {userType === "client" ? "photographer" : "client"} signup
                </button>
              </p>
              <p className="text-sm text-gray-600">
                Already part of our community?{" "}
                <button
                  onClick={() => navigate(userType === "vendor" ? "/vendor/login" : "/login")}
                  className="text-orange-700 hover:text-orange-800 font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Community Showcase */}
        <div className="hidden lg:flex lg:w-3/5 relative">
          {/* Main Hero Image */}
          <div className="absolute inset-0">
            <img
              src = {`https://picsum.photos/seed/${Math.random()}/800/600`}
              alt="Photography community"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-gray-900/80 via-gray-800/60 to-transparent" />
          </div>

          {/* Community Features */}
          <div className="relative z-10 p-12 flex flex-col justify-center h-full">
            <div className="max-w-lg ml-auto text-right">
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                {userType === "vendor" ? (
                  <>
                    Build Your
                    <br />
                    <span className="text-blue-300">Photography Empire</span>
                  </>
                ) : (
                  <>
                    Discover Amazing
                    <br />
                    <span className="text-blue-300">Photographers</span>
                  </>
                )}
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                {userType === "vendor"
                  ? "Join thousands of photographers who are building successful businesses on our platform"
                  : "Connect with talented photographers in your area and book unforgettable sessions"}
              </p>

              {/* Feature List */}
              <div className="space-y-4">
                {userType === "vendor" ? (
                  <>
                    <div className="flex items-center justify-end gap-3 text-blue-100">
                      <span>Professional portfolio showcase</span>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-blue-100">
                      <span>Direct client communication</span>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-blue-100">
                      <span>Secure payment processing</span>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-end gap-3 text-blue-100">
                      <span>Browse verified photographers</span>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-blue-100">
                      <span>Easy booking system</span>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-blue-100">
                      <span>Quality guaranteed</span>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isOtpModalOpen}
        onResend={() => handleOtpSend(userData)}
        isSending={isSending}
        onVerify={handleOtpVerify}
      />
    </div>
  )
}
