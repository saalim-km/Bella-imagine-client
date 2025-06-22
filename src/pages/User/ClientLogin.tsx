import Login from "@/components/auth/Login";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { ILogin } from "@/types/interfaces/User";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useDispatch } from "react-redux";
import { clientLogin } from "@/store/slices/clientSlice";
import { useState } from "react";
import { useSocket } from "@/context/SocketContext";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import Header from "@/components/common/Header";

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
        toast.success(data.message);
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
    <>
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
    </>
  );
};

export default ClientLogin;
