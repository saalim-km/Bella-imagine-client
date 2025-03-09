import Footer from "@/components/common/Footer"
import Header from "@/components/headers/Header"
import Home from "@/components/client/Home"
import { CalendarIcon, CreditCardIcon, HeartIcon, UserPlusIcon } from 'lucide-react';
import { useLogoutMutation } from "@/hooks/auth/useLogout";


const ClientHomePage = () => {
 
    const categories = [
        { name: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
        { name: 'Couples', image: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
        { name: 'Portrait', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80' },
        { name: 'Family', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
      ];    

      const howItWorksSteps = [
        {
          title: "Choose Photographer",
          description: "Browse profiles and find your perfect match",
          icon: <UserPlusIcon className="h-8 w-8 text-gray-600" />
        },
        {
          title: "Pick Date",
          description: "Select your preferred date and time",
          icon: <CalendarIcon className="h-8 w-8 text-gray-600" />
        },
        {
          title: "Book & Pay",
          description: "Secure your booking with easy payment",
          icon: <CreditCardIcon className="h-8 w-8 text-gray-600" />
        },
        {
          title: "Enjoy",
          description: "Get amazing photos of your special moments",
          icon: <HeartIcon className="h-8 w-8 text-gray-600" />
        }
      ];




  return (
    <>
        <Header/>
        <Home categories = {categories} howItWorksSteps = {howItWorksSteps}/>
        <Footer/>
    </>
  )
}

export default ClientHomePage