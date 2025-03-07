import Footer from "@/components/Footer";
import Header from "@/components/headers/Header";
import Signup from "@/components/auth/SignUp";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import React, { useState } from "react";


const ClientSignup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // modal->>>>>>>>>>>>>>>>>>
  function handleOpenModal() {
    setIsModalOpen(true);
  }
  function handleOnClose() {
    setIsModalOpen((prevState) => !prevState);
  }

  return (
    <>
      <Header />
      <div className="p-20">
        <Signup
          onClick={handleOpenModal}
          onClose={handleOnClose}
        />
        {isModalOpen && (
          <AccountTypeModal isOpen={isModalOpen} onClose={handleOnClose} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default ClientSignup;
