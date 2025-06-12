import Login from "@/components/auth/Login";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { useSocket } from "@/context/SocketContext";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { vendorLogin } from "@/store/slices/vendorSlice";
import { ILogin } from "@/types/interfaces/User";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const VendorLogin = () => {
  const dispatch = useDispatch();
  const { mutate: login } = useLoginMutation();
  const [isSending, setIsSending] = useState(false);
  const { reconnect, socket } = useSocket();

  function handleLogin(user: ILogin) {
    setIsSending(true);
    login(user, {
      onSuccess: (data: any) => {
        setIsSending(false);
        console.log(data);
        toast.success(data.message);
        dispatch(vendorLogin(data.data));
        if (socket) {
          reconnect();
        }
      },
      onError: (error) => {
        handleError(error);
        setIsSending(false);
      },
    });
  }

  return (
    <>
      <div>
        <Header />
        <div className="mt-20">
          <Login
            userType="vendor"
            onSubmit={handleLogin}
            isSending={isSending}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VendorLogin;
