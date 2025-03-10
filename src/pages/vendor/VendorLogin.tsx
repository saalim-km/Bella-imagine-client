import Login from '@/components/auth/Login'
import Footer from '@/components/common/Footer'
import Header from '@/components/headers/Header'

const VendorLogin = () => {
  return (
   <>
    <Header/>
    <Login userType='client' onSubmit={()=> console.log('submitteed')} isSending = {false}/>
    <Footer/>
   </>
  )
}

export default VendorLogin