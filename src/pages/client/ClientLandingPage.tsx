import Landing from '@/components/client/Landind'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import AccountTypeModal from '@/components/modals/AccountTypeModal'
import { useState } from 'react'

const ClientLandingPage = () => {
    const [isModalOpen , setIsModalOpen] = useState(false);

    function handleOpenModal() {
        setIsModalOpen(true)
    }

    function handleOnClose() {
      setIsModalOpen((prevState)=> !prevState)
    }
  return (
    <>
        <Header onClick = {handleOpenModal} onClose = {handleOnClose}/>
        <Landing/>
        <Footer/>


        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <AccountTypeModal isOpen={isModalOpen} onClose={handleOnClose} />
            </div>
        )}
    </>
  )
}

export default ClientLandingPage