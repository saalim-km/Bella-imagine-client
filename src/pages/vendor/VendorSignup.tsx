import Signup from "@/components/auth/SignUp";
import { UserLayout } from "@/components/layout/UserLayout";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import { communityToast } from "@/components/ui/community-toast";
import { useSocket } from "@/hooks/socket/useSocket";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { IUser } from "@/types/interfaces/User";
import { useState } from "react";

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
        communityToast.success({ title: data?.message });

        if (socket) {
          reconnect();
        }
      },
      onError: (error) => {
        communityToast.error({description :error.message});
      },
    });
  }
  return (
    <UserLayout setIsModalOpen={handleOpenModal}>
      <Signup
        userType="vendor"
        onSubmit={handleRegister}
        onClick={handleOpenModal}
      />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AccountTypeModal isOpen={isModalOpen} onClose={handleOnClose} />
        </div>
      )}
    </UserLayout>
  );
};

export default VendorSignup;
