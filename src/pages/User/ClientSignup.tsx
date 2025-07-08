import Signup from "@/components/auth/SignUp";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import { useState } from "react";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { IUser } from "@/types/interfaces/User";
import { useSocket } from "@/hooks/socket/useSocket";
import { communityToast } from "@/components/ui/community-toast";
import { UserLayout } from "@/components/layout/UserLayout";

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
      onSuccess: () => {
        communityToast.registerSuccess();

        if (socket) {
          reconnect();
        }
      },
      onError: (error) => {
        communityToast.error({description:error.message});
      },
    });
  }

  return (
    <UserLayout setIsModalOpen={handleOpenModal}>
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
    </UserLayout>
  );
};

export default ClientSignup;
