import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";

export interface UserLayoutProps {
  children: React.ReactNode;
  setIsModalOpen?: () => void;
}

export const UserLayout = ({ children, setIsModalOpen }: UserLayoutProps) => {
  return (
    <>
      <Header onClick={setIsModalOpen} />
      {children}
      <Footer />
    </>
  );
};
