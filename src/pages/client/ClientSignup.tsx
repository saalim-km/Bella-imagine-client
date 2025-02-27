import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Signup from '@/components/auth/SignUp'
import AccountTypeModal from '@/components/modals/AccountTypeModal'
import React, { useState } from 'react'

const ClientSignup = () => {
      const [isModalOpen , setIsModalOpen] = useState(false);
  
      function handleOpenModal() {
          setIsModalOpen(true)
      }
  
      function handleOnClose() {
        setIsModalOpen((prevState)=> !prevState)
      }
  return (
    <>
        <Header/>
        <Signup onClick = {handleOpenModal} onClose = {handleOnClose}/>
        <Footer/>


        {isModalOpen && 
          <AccountTypeModal isOpen = {isModalOpen} onClose={handleOnClose}/>
        }
    </>
  )
}

export default ClientSignup;