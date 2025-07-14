import Login from "@/components/auth/Login";
import { UserLayout } from "@/components/layout/UserLayout";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import { communityToast } from "@/components/ui/community-toast";
import { useSocket } from "@/hooks/socket/useSocket";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { vendorLogin } from "@/store/slices/vendorSlice";
import { ILogin } from "@/types/interfaces/User";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useState } from "react";
import { useDispatch } from "react-redux";

const VendorLogin = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: login } = useLoginMutation();
  const [isSending, setIsSending] = useState(false);
  const { reconnect, socket } = useSocket();

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
        communityToast.welcomePhotographer(data.data.name);

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
    <UserLayout setIsModalOpen={handleOpenModal}>
      <Login
        onClick={handleOpenModal}
        userType="vendor"
        onSubmit={handleLogin}
        isSending={isSending}
      />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AccountTypeModal isOpen={isModalOpen} onClose={handleOnClose} />
        </div>
      )}
    </UserLayout>
  );
};

export default VendorLogin;
