import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router";
import { signupSchema } from "@/utils/formikValidators/auth/signup.validator";
import OTPModal from "@/components/modals/OtpModal";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import GoogleAuth from "./GoogleAuth";
import { IUser, TRole } from "@/types/User";
import { useSendOtp } from "@/hooks/auth/useSendOtp";
import { toast } from "sonner";
import { useOtpVerifyMutataion } from "@/hooks/auth/useOtpVerify";
import { handleError } from "@/utils/Error/errorHandler";
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
  console.log(`usertype ${userType}`);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userData, setUserData] = useState<IUser>({} as IUser);
  const { isDarkMode, textColor, buttonPrimary, bgColor } = useThemeConstants();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: sendVerificationOTP } = useSendOtp();
  const { mutate: verifyOtp } = useOtpVerifyMutataion();
  const { mutate: googleLogin } = useGoogleLoginMutataion();

  const submitRegister = () => {
    onSubmit(userData);
  };

  //----------------------- Mutation Method to handle Otp and Otp veification---------------------------
  function handleOtpSend(user: IUser) {
    console.log(userData);
    setIsSending(true);
    sendVerificationOTP(
      { url: "/send-otp", email: user.email },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setUserData(user);
          setIsSending(false);
          setIsOtpModalOpen(true);
          setTimeout(() => setIsOtpModalOpen(true), 0); // Ensure modal opens
        },
        onError: (error) => {
          setIsSending(false);
          console.log(error);
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
          console.log("otp verified !!111111111111111");
          submitRegister();
          toast.success(data.message);
          setIsOtpModalOpen(false);
          navigate("/login");
        },
        onError: (error) => {
          console.log(
            "an error occurred in verify otp handle222222222222",
            error
          );
          handleError(error);
        },
      }
    );
  }

  function handleGoogle(credentialResponse: CredentialResponse) {
    console.log("data from google");
    console.log(credentialResponse);
    googleLogin(
      {
        credential: credentialResponse.credential,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        role: userType,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          if (userType === "vendor") {
            dispatch(
              vendorLogin({
                _id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
              })
            );
          } else {
            dispatch(
              clientLogin({
                _id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
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
    <div className="flex min-h-screen flex-col md:flex-row justify-center">
      <div className="relative w-2/5 md:w-2/5 min-h-[300px] md:min-h-screen pl-8 pt-8 pb-8 pr-0 md:p-8 rounded-lg overflow-hidden">
        <img
          src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
          alt="Wedding couple"
          className="w-full h-full object-cover opacity-90 rounded-l-2xl"
        />
      </div>

      <div className={`w-full md:w-1/3 flex items-center justify-center`}>
        <div className="w-full max-w-md">
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl font-semibold">
              I'm a {userType === "client" ? "customer" : "Photographer"}
            </h1>
            <p className={textColor}>Registration</p>
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
              console.log(user);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className={`rounded-md h-12 w-full p-2 ${
                      isDarkMode
                        ? `${bgColor} text-white border-gray-700 border`
                        : "bg-white text-black border-gray-300 border"
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`rounded-md h-12 w-full p-2 ${
                      isDarkMode
                        ? `${bgColor} text-white border-gray-700 border`
                        : "bg-white border text-black border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className={`rounded-md h-12 w-full p-2 ${
                      isDarkMode
                        ? `${bgColor} text-white border-gray-700 border`
                        : "bg-white border text-black border-gray-300"
                    }`}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`rounded-md h-12 w-full p-2 ${
                      isDarkMode
                        ? `${bgColor} text-white border-gray-700 border`
                        : "bg-white border text-black border-gray-300"
                    }`}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className={`w-full ${buttonPrimary} text-white h-12 rounded-md`}
                  disabled={isSending}
                >
                  {isSending ? "Sending OTP..." : "Sign up"}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              ></div>
            </div>
            <span
              className={`relative px-2 text-sm ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              } text-gray-400`}
            >
              or
            </span>
          </div>

          <div className="flex align-middle justify-center">
            <GoogleAuth handleGoogleSuccess={handleGoogle} />
          </div>

          <div className="text-center mt-6">
            <p className={textColor}>Not a customer?</p>
            <a className="text-blue-500 hover:underline hover:cursor-pointer">
              Select a different account type
            </a>
          </div>
          <div className="text-center mt-4">
            <p className={textColor}>
              Already have an account?{" "}
              <a
                onClick={() =>
                  navigate(userType === "vendor" ? "/vendor/login" : "/login")
                }
                className="text-blue-500 hover:underline hover:cursor-pointer"
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