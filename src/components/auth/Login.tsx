import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "@/utils/formikValidators/auth/login.validator";
import GoogleAuth from "./GoogleAuth";
import { ILogin, TRole } from "@/types/interfaces/User";
import { CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutataion } from "@/hooks/auth/useGoogleLogin";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clientLogin } from "@/store/slices/clientSlice";
import { handleError } from "@/utils/Error/error-handler.utils";
import { vendorLogin } from "@/store/slices/vendorSlice";
import { useSocket } from "@/context/SocketContext";

interface LoginProps {
  onClick?: () => void;
  userType: TRole;
  onSubmit: (data: ILogin) => void;
  isSending: boolean;
}

export default function Login({
  userType,
  onSubmit,
  isSending,
  onClick,
}: LoginProps) {
  const dispatch = useDispatch();
  const { mutate: Login } = useGoogleLoginMutataion();
  const { reconnect, socket } = useSocket();

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
          toast.success(data.message);
          if (userType === "vendor") {
            dispatch(vendorLogin({
              _id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              avatar: data.user.avatar,
              role: data.user.role
            }));
            if (socket) {
              reconnect();
            }
          } else {
            dispatch(clientLogin({
              _id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              avatar: data.user.avatar,
              role: data.user.role
            }));
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
    <div className="min-h-screen flex flex-col lg:flex-row justify-center backdrop-blur-md">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            {userType === "admin" ? (
              <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
                Admin Login
              </h1>
            ) : (
              <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
                Welcome Back
              </h1>
            )}
            <p className="text-sm">Login to your account</p>
          </div>

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
                  <Field
                    name="email"
                    type="text"
                    placeholder="Email"
                    as={Input}
                    className="rounded-lg h-12 w-full focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    as={Input}
                    className="rounded-lg h-12 w-full focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  />
                  <a
                    href={`/${userType}/forgot-password`}
                    className="text-sm transition-colors inline-block mt-2"
                  >
                    Forgot password
                  </a>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSending}
                    className="w-full h-12 rounded-lg text-sm uppercase tracking-widest transition-all duration-300"
                  >
                    {isSending ? "Verifying..." : "Login"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <span className="relative px-3 text-sm">or</span>
          </div>

          {location.pathname !== "/admin/login" && (
            <div className="flex justify-center">
              <GoogleAuth handleGoogleSuccess={handleGoogleLogin} />
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-sm">Don't have an account?</p>
            <a
              href={userType === "vendor" ? "/vendor/signup" : "/register"}
              className="transition-colors text-sm text-blue-600 hover:underline"
            >
              Sign up
            </a>
            <p className="text-gray-600 my-6">
              Not a {userType === "client" ? "customer" : "photographer"}?{" "}
              <a
                onClick={onClick}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Select a different account type
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative w-full lg:w-2/3 min-h-[300px] lg:min-h-screen p-0 lg:p-8 hidden lg:block">
        <img
          src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/hisu-lee-FTW8ADj5igs-unsplash_ctadks.jpg"
          alt="Wedding couple"
          className="w-full h-full object-cover opacity-90 rounded-r-2xl"
        />
      </div>
    </div>
  );
}