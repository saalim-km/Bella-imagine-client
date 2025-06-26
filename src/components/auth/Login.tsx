"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "@/utils/formikValidators/auth/login.validator";
import GoogleAuth from "./GoogleAuth";
import type { ILogin, TRole } from "@/types/interfaces/User";
import type { CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutataion } from "@/hooks/auth/useGoogleLogin";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clientLogin } from "@/store/slices/clientSlice";
import { handleError } from "@/utils/Error/error-handler.utils";
import { vendorLogin } from "@/store/slices/vendorSlice";
import { useSocket } from "@/context/SocketContext";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Camera,
  Users,
  Star,
  Heart,
  MapPin,
  Award,
} from "lucide-react";
import { communityToast } from "../ui/community-toast";

interface LoginProps {
  onClick?: () => void;
  userType: TRole;
  onSubmit: (data: ILogin) => void;
  isSending: boolean;
}

export default function CommunityLogin({
  userType,
  onSubmit,
  isSending,
  onClick,
}: LoginProps) {
  const dispatch = useDispatch();
  const { mutate: Login } = useGoogleLoginMutataion();
  const { reconnect, socket } = useSocket();
  const [showPassword, setShowPassword] = useState(false);

  function handleGoogleLogin(credentialResponse: CredentialResponse) {
    Login(
      {
        credential: credentialResponse.credential,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        role: userType,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          communityToast.success({ title: data?.message , description : 'User authenticated successfully'});

          if (userType === "vendor") {
            dispatch(
              vendorLogin({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                avatar: data.user.avatar,
                role: data.user.role,
              })
            );
            if (socket) {
              reconnect();
            }
          } else {
            dispatch(
              clientLogin({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                avatar: data.user.avatar,
                role: data.user.role,
              })
            );
            if (socket) {
              reconnect();
            }
          }
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 float-animation" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-orange-100 rounded-full opacity-30 float-animation"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Community Showcase */}
        <div className="hidden lg:flex lg:w-3/5 relative">
          {/* Main Hero Image */}
          <div className="absolute inset-0">
            <img
              src={`https://picsum.photos/seed/${Math.random()}/800/600`}
              alt="Photography community"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/20 to-transparent" />
          </div>

          {/* Community Stats Overlay */}
          <div className="relative z-10 p-12 flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Join the Creative
                <br />
                <span className="text-orange-300">Community</span>
              </h1>
              <p className="text-xl text-orange-100 mb-8 max-w-md">
                {userType === "vendor"
                  ? "Showcase your talent, connect with clients, and grow your photography business"
                  : "Discover amazing photographers, book sessions, and capture your precious moments"}
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Camera className="w-6 h-6 text-orange-300" />
                  <span className="text-2xl font-bold text-white">2.5K+</span>
                </div>
                <p className="text-orange-100 text-sm">Active Photographers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-orange-300" />
                  <span className="text-2xl font-bold text-white">15K+</span>
                </div>
                <p className="text-orange-100 text-sm">Happy Clients</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-6 h-6 text-orange-300" />
                  <span className="text-2xl font-bold text-white">50K+</span>
                </div>
                <p className="text-orange-100 text-sm">Sessions Completed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-6 h-6 text-orange-300" />
                  <span className="text-2xl font-bold text-white">4.9</span>
                </div>
                <p className="text-orange-100 text-sm">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12 bg-white/80 backdrop-blur-sm">
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
                    <Camera className="w-8 h-8 text-white" />
                  ) : (
                    <Users className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>

              {userType === "admin" ? (
                <h2 className="text-3xl font-bold text-gray-900">
                  Admin Portal
                </h2>
              ) : (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Welcome Back!
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {userType === "vendor"
                      ? "Continue building your photography business"
                      : "Ready to find your perfect photographer?"}
                  </p>
                </div>
              )}
            </div>

            {/* Login Form */}
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={(values, { setSubmitting }) => {
                const loginData = {
                  email: values.email,
                  password: values.password,
                  role: userType,
                };
                setSubmitting(false);
                onSubmit(loginData);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      as={Input}
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-black"
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
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        as={Input}
                        className="h-12 pr-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-black"
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

                    {userType !== "admin" && (
                      <div className="mt-2 text-right">
                        <a
                          href={`/${userType}/forgot-password`}
                          className="text-sm text-orange-700 hover:text-orange-800 hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isSending}
                    className={`w-full h-12 text-white font-medium ${
                      userType === "vendor"
                        ? "community-gradient"
                        : "photographer-gradient"
                    } hover:opacity-90`}
                  >
                    {isSending ? "Signing in..." : "Sign In to Community"}
                  </Button>
                </Form>
              )}
            </Formik>

            {userType !== "admin" && (
              <>
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google Auth */}
                {location.pathname !== "/admin/login" && (
                  <div className="flex justify-center">
                    <GoogleAuth handleGoogleSuccess={handleGoogleLogin} />
                  </div>
                )}

                {/* Footer Links */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    New to our community?{" "}
                    <a
                      href={
                        userType === "vendor" ? "/vendor/signup" : "/signup"
                      }
                      className="text-orange-700 hover:text-orange-800 font-medium hover:underline"
                    >
                      Join now
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    {userType === "client"
                      ? "Want to become a photographer?"
                      : "Looking to hire photographers?"}{" "}
                    <button
                      onClick={onClick}
                      className="text-orange-700 hover:text-orange-800 font-medium hover:underline"
                    >
                      Switch to{" "}
                      {userType === "client" ? "photographer" : "client"}{" "}
                      account
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
