import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "../common/Google-icon";
import { useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "@/utils/formikValidators/login.validator";
import {useThemeConstants} from '../../utils/theme/themeUtills'

export default function Login() {
  const navigate = useNavigate();
  const {isDarkMode , textColor , buttonPrimary , borderColor} = useThemeConstants()




  return (
    <div className="flex min-h-screen flex-col md:flex-row justify-center">
      {/* Left Side - Login Form */}
      <div className={`w-full md:w-1/3 flex items-center justify-center p-0`}>
        <div className="w-full max-w-md ">
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl font-semibold">Welcome Back</h1>
            <p className={textColor}>Login to your account</p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
              console.log("Login Submitted:", values);
              setSubmitting(false);
              // Add navigation or API call here if needed
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
                        ? "bg-gray-800 text-white border-gray-700"
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
                        ? "bg-gray-800 text-white border-gray-700"
                        : "bg-white text-black border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${buttonPrimary} text-white h-12 rounded-md`}
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${borderColor}`}></div>
            </div>
            <span
              className={`relative px-2 text-sm ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              } text-gray-400`}
            >
              or
            </span>
          </div>

          <Button
            variant="outline"
            className={`w-full flex items-center justify-center h-12 rounded-md ${borderColor} ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            <GoogleIcon />
            <span className="ml-2">Login with Google</span>
          </Button>

          <div className="text-center mt-6">
            <p className={textColor}>Don't have an account?</p>
            <a
              onClick={() => navigate("/register")}
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