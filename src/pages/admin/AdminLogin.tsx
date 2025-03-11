import Login from '@/components/auth/Login'
import Footer from '@/components/common/Footer'
import Header from '@/components/headers/Header'
import React from 'react'

const AdminLogin = () => {
  return (
    <>
        <Header/>
        <Login userType='admin'/>
        <Footer/>
    </>
  )
}

export default AdminLogin