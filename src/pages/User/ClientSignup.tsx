import Header from "@/components/headers/Header";
import Signup from "@/components/auth/SignUp";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import { useState } from "react";
import Footer from "@/components/common/Footer";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { IUser } from "@/types/User";
import { toast } from "sonner";
import { useSocket } from "@/context/SocketContext";

const ClientSignup = () => {
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

  return (
    <>
      <Header />
      <div className="p-20">
        <Signup
          onClick={handleOpenModal}
          userType="client"
          onSubmit={handleRegister}
        />
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <AccountTypeModal isOpen={isModalOpen} onClose={handleOnClose} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ClientSignup;
