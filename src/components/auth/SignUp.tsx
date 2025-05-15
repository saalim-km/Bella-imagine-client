import { useState } from "react";
import { motion } from "framer-motion";
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
      { url: "/send-otp", email: user.email },
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col lg:flex-row justify-center backdrop-blur-md"
    >
      {/* Left Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative w-full lg:w-2/5 min-h-[300px] lg:min-h-screen p-0 lg:p-8 hidden lg:block"
      >
        <img
          src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
          alt="Wedding couple"
          className="w-full h-full object-cover opacity-90 rounded-l-2xl"
        />
      </motion.div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center space-y-2"
          >
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight ">
              I'm a {userType === "client" ? "Customer" : "Photographer"}
            </h1>
            <p className="/60 text-sm">Create your account</p>
          </motion.div>

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
              <Form className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="relative">
                    <Field
                      as={Input}
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="rounded-lg h-12 w-full focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="relative">
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="rounded-lg h-12 w-full  focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="relative">
                    <Field
                      as={Input}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="rounded-lg h-12 w-full  focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-4 cursor-pointer /60 hover:"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="relative">
                    <Field
                      as={Input}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="rounded-lg h-12 w-full  focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-4 cursor-pointer /60 hover:"
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-lg text-sm uppercase tracking-widest transition-all duration-300"
                    disabled={isSending || isSubmitting}
                  >
                    {isSending ? "Sending OTP..." : "Sign up"}
                  </Button>
                </motion.div>
              </Form>
            )}
          </Formik>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative flex items-center justify-center my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <span className="relative px-3 text-sm /60">
              or
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex justify-center"
          >
            <GoogleAuth handleGoogleSuccess={handleGoogle} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="text-center mt-6 space-y-2"
          >
            <p className="/60 text-sm">
              Not a {userType === "client" ? "customer" : "photographer"}?
            </p>
            <a
              onClick={onClick}
              className="text-sm cursor-pointer text-blue-600 hover:underline"
            >
              Select a different account type
            </a>
            <p className="text-sm pt-2">
              Already have an account?{" "}
              <a
                onClick={() =>
                  navigate(userType === "vendor" ? "/vendor/login" : "/login")
                }
                className="/80 hover: transition-colors cursor-pointer text-blue-600 hover:underline"
              >
                Sign in
              </a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={isOtpModalOpen}
        onResend={() => handleOtpSend(userData)}
        isSending={isSending}
        onVerify={handleOtpVerify}
      />
    </motion.div>
  );
}
