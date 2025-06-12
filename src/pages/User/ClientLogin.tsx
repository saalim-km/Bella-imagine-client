import Login from "@/components/auth/Login";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { ILogin } from "@/types/interfaces/User";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useDispatch } from "react-redux";
import { clientLogin } from "@/store/slices/clientSlice";
import { useState } from "react";
import { useSocket } from "@/context/SocketContext";

const ClientLogin = () => {
  const { reconnect, socket } = useSocket();
  const dispatch = useDispatch();
  const { mutate: login } = useLoginMutation();
  const [isSending, setIsSending] = useState(false);

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
      <Login userType="client" onSubmit={handleLogin} isSending={isSending} />
    </>
  );
};

export default ClientLogin;
