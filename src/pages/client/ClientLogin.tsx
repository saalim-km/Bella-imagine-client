import Footer from '@/components/Footer'
import Header from '@/components/headers/Header'
import Login from '@/components/auth/Login'
import React from 'react'
import ThemeToggle from '@/components/common/ThemeToggle'
import Logo from '@/components/common/Logo'

const ClientLogin = () => {
  return (
    <>
    <Header/>
    <div className='p-10'>
        <Login/>
    </div>
    <Footer/>
    </>
  )
}

export default ClientLogin