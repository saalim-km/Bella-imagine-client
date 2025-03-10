import Footer from "@/components/common/Footer"
import Header from "@/components/headers/Header"
import Home from "@/components/User/Home"
import HomePhotographerSearch from "@/components/User/HomePhotographerSearch";


const ClientHomePage = () => {
 

  return (
    <>
        <Header/>
        <HomePhotographerSearch/>
        <Home/>
        <Footer/>
    </>
  )
}

export default ClientHomePage