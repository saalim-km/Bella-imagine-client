import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "@/utils/formikValidators/login.validator";
import { useThemeConstants } from "../../utils/theme/themeUtills";
import GoogleAuth from "./GoogleAuth";
import { ILogin, TRole } from "@/types/User";
import { CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutataion } from "@/hooks/auth/useGoogleLogin";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clientLogin } from "@/store/slices/clientSlice";
import { handleError } from "@/utils/Error/errorHandler";
import { vendorLogin } from "@/store/slices/vendorSlice";

interface loginProps {
  userType: TRole;
  onSubmit: (data: ILogin) => void;
  isSending: boolean;
}

export default function Login({ userType, onSubmit, isSending }: loginProps) {
  console.log(`usertype is ${userType}`)
  const dispatch = useDispatch();
  const { mutate: Login } = useGoogleLoginMutataion();
  const navigate = useNavigate();
  const { isDarkMode, textColor, buttonPrimary, bgColor } = useThemeConstants();
  
  function handleGoogleLogin(credentialResponse: CredentialResponse) {
    console.log(credentialResponse);
    Login(
      {
        credential: credentialResponse.credential,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        role: userType,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          if (userType === "vendor") {
            dispatch(vendorLogin(data.user));
          } else {
            dispatch(clientLogin(data.user));
          }
          navigate("/home");
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row justify-center">
      {/* Left Side - Login Form */}
      <div className={`w-full md:w-1/3 flex items-center justify-center p-0`}>
        <div className="w-full max-w-md ">
          <div className="text-center space-y-1 mb-6">
            {userType === "admin" ? (
              <h1 className="text-2xl font-semibold">Admin Login</h1>
            ) : (
              <h1 className="text-2xl font-semibold">Welcome Back</h1>
            )}
            <p className={textColor}>Login to your account</p>
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
              console.log("Login Submitted:", loginData);
              setSubmitting(false);
              onSubmit(loginData);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    as={Input}
                    className={`rounded-md h-12 w-full ${
                      isDarkMode
                        ? `${bgColor} text-white border-gray-700 border`
                        : "bg-white text-black border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    as={Input}
                    className={`rounded-md h-12 w-full ${
                      isDarkMode
                        ? `${bgColor} text-white border-gray-700 border`
                        : "bg-white text-black border-gray-300"
                    }`}
                  />
                    <label onClick={()=> navigate(`/${userType}/forgot-password`)} htmlFor="" className="text-sm text-blue-500 hover:cursor-pointer">Forgot password</label>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isSending}
                  className={`w-full ${buttonPrimary} text-white h-12 rounded-md`}
                >
                  {isSending ? ".....verifying" : "Login"}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t`}></div>
            </div>
            <span
              className={`relative px-2 text-sm ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              } text-gray-400`}
            >
              or
            </span>
          </div>

          {location.pathname !== "/admin/login" && (
            <div className="flex align-middle justify-center">
              <GoogleAuth handleGoogleSuccess={handleGoogleLogin} />
            </div>
          )}

          <div className="text-center mt-6">
            <p className={textColor}>Don't have an account?</p>
            <a
              onClick={() =>
                navigate(userType === "vendor" ? "/vendor/signup" : "/register")
              }
              className="text-blue-500 hover:cursor-pointer"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative w-2/5 md:w-2/5 min-h-[300px] md:min-h-screen pl-0 pt-8 pb-8 pr-8 md:p-8 rounded-lg overflow-hidden">
        <img
          src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1741187701/hisu-lee-FTW8ADj5igs-unsplash_ctadks.jpg"
          alt="Wedding couple"
          className="w-full h-full object-cover opacity-90 rounded-r-2xl"
        />
      </div>
    </div>
  );
}
