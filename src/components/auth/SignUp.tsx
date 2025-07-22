"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router";
import { signupSchema } from "@/utils/formikValidators/auth/signup.validator";
import OTPModal from "@/components/modals/OtpModal";
import GoogleAuth from "./GoogleAuth";
import type { IUser, TRole } from "@/types/interfaces/User";
import { useSendOtp } from "@/hooks/auth/useSendOtp";
import { useOtpVerifyMutataion } from "@/hooks/auth/useOtpVerify";
import { handleError } from "@/utils/Error/error-handler.utils";
import type { CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutataion } from "@/hooks/auth/useGoogleLogin";
import { clientLogin } from "@/store/slices/clientSlice";
import { useDispatch } from "react-redux";
import { vendorLogin } from "@/store/slices/vendorSlice";
import {
  Eye,
  EyeOff,
  Camera,
  Users,
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
} from "lucide-react";
import { communityToast } from "../ui/community-toast";

interface SignUpProps {
  onSubmit: (data: IUser) => void;
  userType: TRole;
  onClick?: () => void;
}

export default function CommunitySignup({
  onSubmit,
  userType,
  onClick,
}: SignUpProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userData, setUserData] = useState<IUser>({} as IUser);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [randomNumber,setRandomNumber] = useState(Math.random())

  const { mutate: sendVerificationOTP } = useSendOtp();
  const { mutate: verifyOtp } = useOtpVerifyMutataion();
  const { mutate: googleLogin } = useGoogleLoginMutataion();

  const submitRegister = () => {
    onSubmit(userData);
  };

  function handleOtpSend(user: IUser) {
    setIsSending(true);
    sendVerificationOTP(
      { url: "/send-otp", email: user.email, role: userType },
      {
        onSuccess: () => {
          communityToast.success({
            title: "OTP sent to your email",
            description:
              "Please check your inbox and enter the OTP to verify your email address.",
          });

          setUserData(user);
          setIsSending(false);
          setIsOtpModalOpen(true);
          setTimeout(() => setIsOtpModalOpen(true), 0);
        },
        onError: (error) => {
          setIsSending(false);
          handleError(error);
        },
      }
    );
  }

  function handleOtpVerify(otp: string) {
    verifyOtp(
      { email: userData.email, otp },
      {
        onSuccess: () => {
          submitRegister();
          communityToast.registerSuccess();

          setIsOtpModalOpen(false);
          navigate("/login");
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
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
          communityToast.registerSuccess();

          if (userType === "vendor") {
            dispatch(
              vendorLogin({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                avatar: data.user.avatar,
              })
            );
          } else {
            dispatch(
              clientLogin({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                avatar: data.user.avatar,
              })
            );
          }
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  }

  useEffect(()=> {
    const interval = setInterval(() => {
      setRandomNumber(Math.random())
    }, 5000);

    return ()=> {
      clearInterval(interval)
    }
  },[])


  return (
    <div className="min-h-screen bg-gradient-to-br relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Signup Form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12  backdrop-blur-sm">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    userType === "vendor"
                      ? "community-gradient"
                      : "photographer-gradient"
                  }`}
                >
                  {userType === "vendor" ? (
                    <Camera className="w-8 h-8 " />
                  ) : (
                    <Users className="w-8 h-8 " />
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  {userType === "vendor"
                    ? "Become a Photographer"
                    : "Join Our Community"}
                </h1>
                <p className="dark:text-gray-300 mt-2">
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
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Showcase Work
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Grow Business
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <Globe className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Find Talent
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Easy Booking
                    </span>
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
                };
                handleOtpSend(user);
              }}
            >
              {() => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium  mb-2"
                    >
                      Full Name
                    </label>
                    <Field
                      as={Input}
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="h-12 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500 "
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium  mb-2"
                    >
                      Email Address
                    </label>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="h-12 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500 "
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium  mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        as={Input}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        className="h-12 pr-12 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500 "
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
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <div className="relative">
                      <Field
                        as={Input}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className="h-12 pr-12 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500 "
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className={`w-full h-12  font-medium ${
                      userType === "vendor"
                        ? "community-gradient"
                        : "photographer-gradient"
                    } hover:opacity-90`}
                    disabled={isSending}
                  >
                    {isSending
                      ? "Creating account..."
                      : `Join as ${
                          userType === "vendor" ? "Photographer" : "Client"
                        }`}
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
                <span className="px-2 dark:bg-background dark:text-white bg-white text-gray-900">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Auth */}
            <div className="flex justify-center">
              <GoogleAuth handleGoogleSuccess={handleGoogle} />
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-3">
              <p className="text-sm dark:text-gray-400">
                {userType === "client"
                  ? "Want to become a photographer?"
                  : "Looking to hire photographers?"}{" "}
                <button
                  onClick={onClick}
                  className="dark:text-orange-400 text-orange-700 hover:text-orange-800 font-medium hover:underline"
                >
                  Switch to {userType === "client" ? "photographer" : "client"}{" "}
                  signup
                </button>
              </p>
              <p className="text-sm dark:text-gray-400">
                Already part of our community?{" "}
                <button
                  onClick={() =>
                    navigate(userType === "vendor" ? "/vendor/login" : "/login")
                  }
                  className="dark:text-orange-400 text-orange-700 hover:text-orange-800 font-medium hover:underline"
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
              src={`https://picsum.photos/seed/${randomNumber}/800/600`}
              alt="Photography community"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0  to-transparent bg-black/50" />
          </div>

          {/* Community Features */}
          <div className="relative z-10 p-12 flex flex-col justify-center h-full">
            <div className="max-w-lg ml-auto text-right">
              <h2 className="text-5xl font-bold text-orange-400  mb-6 leading-tight">
                {userType === "vendor" ? (
                  <>
                    Build Your
                    <br />
                    <span className="text-orange-200">Photography Empire</span>
                  </>
                ) : (
                  <>
                    Discover Amazing
                    <br />
                    <span className="text-orange-300">Photographers</span>
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
                    <div className="flex items-center justify-end gap-3 text-orange-100">
                      <span>Professional portfolio showcase</span>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Camera className="w-4 h-4 " />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-orange-100">
                      <span>Direct client communication</span>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 " />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-orange-100">
                      <span>Secure payment processing</span>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 " />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-end gap-3 text-orange-100">
                      <span>Browse verified photographers</span>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Globe className="w-4 h-4 " />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-orange-100">
                      <span>Easy booking system</span>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 " />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-orange-100">
                      <span>Quality guaranteed</span>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 " />
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
  );
}
