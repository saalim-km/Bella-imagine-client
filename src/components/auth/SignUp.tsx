import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/common/Google-icon";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router";
import { signupSchema } from "@/utils/formikValidators/signup.validator";
import OTPModal from "@/components/modals/OtpModal";
import { useThemeConstants } from "@/utils/theme/themeUtills";


interface ISignup {
  onClick: () => void;
  onClose: () => void;
  onSignupSubmit: (data: any) => void; 
  handleOtpverify : (data : any)=> void;
}

export default function Signup({ onClick }: ISignup) {
  const navigate = useNavigate();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const {isDarkMode ,textColor , buttonPrimary } = useThemeConstants()



  return (
    <div className="flex min-h-screen flex-col md:flex-row justify-center">
      <div className="relative w-2/5 md:w-2/5 min-h-[300px] md:min-h-screen pl-8 pt-8 pb-8 pr-0 md:p-8 rounded-lg overflow-hidden">
        <img
          src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
          alt="Wedding couple"
          className="w-full h-full object-cover opacity-90 rounded-l-lg"
        />
      </div>

      <div className={`w-full md:w-1/3 flex items-center justify-cente `}>
        <div className="w-full max-w-md">
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl font-semibold">I'm a customer</h1>
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
            onSubmit={}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className={`rounded-md h-12 w-full p-2 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700 border' : 'bg-white text-black border-gray-300 border'}`}
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`rounded-md h-12 w-full p-2 ${isDarkMode ? 'bg-gray-800 border text-white border-gray-700' : 'bg-white border text-black border-gray-300'}`}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={`rounded-md h-12 w-full p-2 ${isDarkMode ? 'bg-gray-800 border text-white border-gray-700' : 'bg-white border text-black border-gray-300'}`}
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`rounded-md h-12 w-full p-2 ${isDarkMode ? 'bg-gray-800 border text-white border-gray-700' : 'bg-white border text-black border-gray-300'}`}
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <Button type="submit" className={`w-full ${buttonPrimary} text-white h-12 rounded-md`} disabled={isSubmitting}>
                  Sign up
                </Button>
              </Form>
            )}
          </Formik>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
            </div>
            <span className={`relative px-2 text-sm ${isDarkMode ? 'bg-gray-900' : 'bg-white'} text-gray-400`}>or</span>
          </div>

          <Button variant="outline" className={`w-full flex items-center justify-center h-12 rounded-md ${isDarkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-black'}`}>
            <GoogleIcon />
            <span className="ml-2">Sign up with Google</span>
          </Button>

          <div className="text-center mt-6">
            <p className={textColor}>Not a customer?</p>
            <a onClick={() => onClick?.()} className="text-blue-500 hover:underline hover:cursor-pointer">
              Select a different account type
            </a>
          </div>
          <div className="text-center mt-4">
            <p className={textColor}>
              Already have an account?{" "}
              <a onClick={() => navigate("/login")} className="text-blue-500 hover:underline hover:cursor-pointer">Sign in</a>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)} onVerify={} onResend={() => console.log("Resend OTP")}/>
    </div>
  );
}