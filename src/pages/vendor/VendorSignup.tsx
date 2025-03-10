import Signup from '@/components/auth/SignUp'
import Footer from '@/components/common/Footer'
import Header from '@/components/headers/Header'
import React from 'react'

const VendorSignup = () => {
  return (
    <>
        <Header/>
        <Signup userType='vendor' onSubmit={()=> console.log('for sub mitted')}/>
        <Footer/>
    </>
  )
}

export default VendorSignup