import Landing from "@/components/User/Landing";
import { UserLayout } from "@/components/layout/UserLayout";
import AccountTypeModal from "@/components/modals/AccountTypeModal";
import { useState } from "react";

const ClientLandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleOnClose() {
    setIsModalOpen(false);
  }

  return (
    <UserLayout setIsModalOpen={handleOpenModal}>
      <Landing />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AccountTypeModal isOpen={isModalOpen} onClose={handleOnClose} />
        </div>
      )}
    </UserLayout>
  );
};

export default ClientLandingPage;
