import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/Google-icon";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";

interface ISignup {
  onClick : () => void;
  onClose : () => void;
}

export default function Signup({onClick,onClose} : ISignup) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col md:flex-row justify-center">
      {/* Left Side - Image */}
      <div className="relative w-full md:w-2/5 min-h-[300px] md:min-h-screen bg-black">
        <img
          src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
          alt="Wedding couple"
          className="w-full h-auto object-cover opacity-90"
        />
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl font-semibold">I'm a customer</h1>
            <p className="text-gray-500">Registration</p>
          </div>

          {/* Formik Form */}
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .matches(
                  /^(?!\s+$)[A-Za-z\s]+$/,
                  "Name can only contain letters and spaces (not only spaces)"
                )
                .required("Name is required"),
              email: Yup.string()
                .email("Invalid email format")
                .matches(
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov)$/,
                  "Email must end with .com, .in, .org, etc."
                )
                .required("Email is required"),
              password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .matches(/[a-z]/, "Must include a lowercase letter")
                .matches(/[A-Z]/, "Must include an uppercase letter")
                .matches(/[0-9]/, "Must include a number")
                .matches(/[\W_]/, "Must include a special character")
                .required("Password is required"),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), ""], "Passwords must match")
                .required("Confirm password is required"),
            })}          
            onSubmit={(values, { setSubmitting }) => {
              console.log("Form Submitted:", values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="rounded-md h-12 w-full border p-2"
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
                    className="rounded-md h-12 w-full border p-2"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="rounded-md h-12 w-full border p-2"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="rounded-md h-12 w-full border p-2"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#6b6056] hover:bg-[#6b6056]/90 text-white h-12 rounded-md"
                  disabled={isSubmitting}
                >
                  Sign up
                </Button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative bg-white px-2 text-sm text-gray-400">or</span>
          </div>

          {/* Google Sign Up */}
          <Button
            variant="outline"
            className="w-full border-gray-300 flex items-center justify-center h-12 rounded-md"
          >
            <GoogleIcon />
            <span className="ml-2">Sign up with Google</span>
          </Button>

          {/* Navigation Links */}
          <div className="text-center mt-6">
            <p className="text-gray-700">Not a customer?</p>
            <a onClick={()=> onClick?.()} className="text-blue-500 hover:underline hover:cursor-pointer">
              Select a different account type
            </a>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-700">
              Already have an account?{" "}
              <a onClick={()=> navigate("/login")} className="text-blue-500 hover:underline hover:cursor-pointer">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}