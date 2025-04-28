import Signup from "@/components/auth/SignUp";
import Footer from "@/components/common/Footer";
import Header from "@/components/headers/Header";
import { useSocket } from "@/context/SocketContext";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { IUser } from "@/types/User";
import { toast } from "sonner";

const VendorSignup = () => {
  const { mutate: registerClient } = useRegisterMutation();
  const { reconnect, socket } = useSocket();

  function handleRegister(data: IUser) {
    registerClient(data, {
      onSuccess: (data) => {
        toast.success(data.message);
        if (socket) {
          reconnect();
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }
  return (
    <>
      <Header />
      <div className="p-20">
        <Signup userType="vendor" onSubmit={handleRegister} />
      </div>
      <Footer />
    </>
  );
};

export default VendorSignup;
