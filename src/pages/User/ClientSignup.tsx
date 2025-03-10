import Header from "@/components/headers/Header";
import Signup from "@/components/auth/SignUp";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import { useState } from "react";
import Footer from "@/components/common/Footer";
import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { IUser } from "@/types/User";
import { toast } from "sonner";


const ClientSignup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {mutate : registerClient} = useRegisterMutation()

  // modal->>>>>>>>>>>>>>>>>>
  function handleOpenModal() {
    setIsModalOpen(true);
  }
  function handleOnClose() {
    setIsModalOpen(false);
  }

  function handleRegister(data : IUser) {
    registerClient(data , {
      onSuccess : (data)=> {
        toast.success(data.message)
      },
      onError : (error)=> {
        toast.error(error.message);
      }
    })
  }

  return (
    <>
      <Header onClick={handleOpenModal}/>
      <div className="p-20">
        <Signup userType="client" onSubmit={handleRegister}
        />
        {isModalOpen && (
          <AccountTypeModal isOpen={isModalOpen} onClose={handleOnClose} />
        )}
      </div>
      <Footer/>
    </>
  );
};

export default ClientSignup;
