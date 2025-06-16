import Signup from "@/components/auth/SignUp";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import { useSocket } from "@/context/SocketContext";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { IUser } from "@/types/interfaces/User";
import { useState } from "react";
import { toast } from "sonner";

const VendorSignup = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: registerClient } = useRegisterMutation();
  const { reconnect, socket } = useSocket();
    function handleOpenModal() {
    setIsModalOpen(true);
  }
  function handleOnClose() {
    setIsModalOpen(false);
  }

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
  return(
  <>
  
  <Signup userType="vendor" onSubmit={handleRegister} onClick={handleOpenModal}/>
        {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AccountTypeModal isOpen={isModalOpen} onClose={handleOnClose} />
        </div>
      )}
  </>
  )
};

export default VendorSignup;
