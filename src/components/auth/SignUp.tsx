import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router";
import { signupSchema } from "@/utils/formikValidators/auth/signup.validator";
import OTPModal from "@/components/modals/OtpModal";
import GoogleAuth from "./GoogleAuth";
import { IUser, TRole } from "@/types/interfaces/User";
import { useSendOtp } from "@/hooks/auth/useSendOtp";
import { toast } from "sonner";
import { useOtpVerifyMutataion } from "@/hooks/auth/useOtpVerify";
import { handleError } from "@/utils/Error/error-handler.utils";
import { CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutataion } from "@/hooks/auth/useGoogleLogin";
import { clientLogin } from "@/store/slices/clientSlice";
import { useDispatch } from "react-redux";
import { vendorLogin } from "@/store/slices/vendorSlice";
import { Eye, EyeOff } from "lucide-react";

interface SignUpProps {
  onSubmit: (data: IUser) => void;
  userType: TRole;
  onClick?: () => void;
}

export default function Signup({ onSubmit, userType, onClick }: SignUpProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userData, setUserData] = useState<IUser>({} as IUser);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        onSuccess: (data) => {
          toast.success(data.message);
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
        onSuccess: (data) => {
          submitRegister();
          toast.success(data.message);
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
          console.log('after google register of user : ',data);
          toast.success(data.message);
          if (userType === "vendor") {
            dispatch(
              vendorLogin({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                avatar: data.user.avatar
              })
            );
          } else {
            dispatch(
              clientLogin({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                avatar: data.user.avatar
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

  return (
    <div className="h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 h-full">
        <img
          src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
          alt="Wedding photography"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl tracking-tight">
              I'm a {userType === "client" ? "Customer" : "Photographer"}
            </h1>
            <p className="text-sm text-gray-600">Create your account</p>
          </div>

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
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <div className="relative">
                    <Field
                      as={Input}
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="rounded-lg h-12 w-full"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="rounded-lg h-12 w-full"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Field
                      as={Input}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="rounded-lg h-12 w-full pr-10"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-4 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Field
                      as={Input}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="rounded-lg h-12 w-full pr-10"
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-4 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </span>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-lg text-sm uppercase tracking-widest"
                    disabled={isSending}
                  >
                    {isSending ? "Sending OTP..." : "Sign up"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <span className="relative px-3 text-sm text-gray-500 bg-white">
              or
            </span>
          </div>

          <div className="flex justify-center mb-4">
            <GoogleAuth handleGoogleSuccess={handleGoogle} />
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Not a {userType === "client" ? "customer" : "photographer"}?{" "}
              <a
                onClick={onClick}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Select a different account type
              </a>
            </p>
            <p className="mt-2 text-gray-600">
              Already have an account?{" "}
              <a
                onClick={() =>
                  navigate(userType === "vendor" ? "/vendor/login" : "/login")
                }
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Sign in
              </a>
            </p>
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