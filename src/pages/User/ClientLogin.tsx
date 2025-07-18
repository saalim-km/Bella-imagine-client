import Login from "@/components/auth/Login";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { ILogin } from "@/types/interfaces/User";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useDispatch } from "react-redux";
import { clientLogin } from "@/store/slices/clientSlice";
import { useState } from "react";
import { useSocket } from "@/hooks/socket/useSocket";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import { communityToast } from "@/components/ui/community-toast";
import { UserLayout } from "@/components/layout/UserLayout";

const ClientLogin = () => {
  const { reconnect, socket } = useSocket();
  const dispatch = useDispatch();
  const { mutate: login } = useLoginMutation();
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleOnClose() {
    setIsModalOpen(false);
  }

  function handleLogin(user: ILogin) {
    setIsSending(true);
    login(user, {
      onSuccess: (data: any) => {
        setIsSending(false);
        communityToast.welcomeClient(data.data.name);

        dispatch(clientLogin(data.data));
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
    <UserLayout setIsModalOpen={handleOpenModal}>
      <Login
        userType="client"
        onSubmit={handleLogin}
        isSending={isSending}
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

export default ClientLogin;
