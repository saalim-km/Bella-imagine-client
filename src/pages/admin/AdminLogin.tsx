import Login from "@/components/auth/Login";
import { communityToast } from "@/components/ui/community-toast";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { adminLogin } from "@/store/slices/adminSlice";
import { ILogin } from "@/types/interfaces/User";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: login } = useLoginMutation();
  const [isSending, setIsSending] = useState(false);

  function handleLogin(user: ILogin) {
    setIsSending(true);
    login(user, {
      onSuccess: (data: any) => {
        setIsSending(false);
        console.log(data);
        communityToast.success({
          title: data?.message,
          description: "User authenticated successfully",
        });

        dispatch(adminLogin(data.data));
        navigate("/admin/dashboard");
      },
      onError: (error) => {
        handleError(error);
        setIsSending(false);
      },
    });
  }
  return (
    <Login userType="admin" isSending={isSending} onSubmit={handleLogin} />
  );
};

export default AdminLogin;
