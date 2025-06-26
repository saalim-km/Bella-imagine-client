import Login from "@/components/auth/Login";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
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
        console.log(data);
                  communityToast.success({title : data?.message});
        
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
    </>
  );
};

export default VendorLogin;
