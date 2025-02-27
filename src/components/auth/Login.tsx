import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "../Google-icon";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl font-semibold">Welcome Back</h1>
            <p className="text-gray-500">Login to your account</p>
          </div>

          <div className="space-y-4">
            <Input type="email" placeholder="Email" className="rounded-md h-12" />
            <Input type="password" placeholder="Password" className="rounded-md h-12" />

            <Button className="w-full bg-[#6b6056] hover:bg-[#6b6056]/90 text-white h-12 rounded-md">
              Login
            </Button>

            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-2 text-sm text-gray-400">or</span>
            </div>

            <Button variant="outline" className="w-full border-gray-300 flex items-center justify-center h-12 rounded-md">
              <GoogleIcon/>
              <span className="ml-2">Login with Google</span>
            </Button>

            <div className="text-center mt-6">
              <p className="text-gray-700">Don't have an account?</p>
              <a onClick={()=> navigate("/register")} className="text-blue-500 hover:cursor-pointer">Sign up</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative w-full md:w-2/5 min-h-[300px] md:min-h-screen bg-black">
        <img
          src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
          alt="Wedding couple"
          className="w-full h-full object-cover opacity-90"
        />
      </div>
    </div>
  );
}
