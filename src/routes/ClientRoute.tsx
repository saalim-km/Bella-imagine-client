import VendorDetails from '@/components/client/VendorDetails'
import ClientLandingPage from '@/pages/client/ClientLandingPage'
import ClientLogin from '@/pages/client/ClientLogin'
import ClientSignup from '@/pages/client/ClientSignup'
import Vendors from '@/pages/client/Vendors'
import React from 'react'
import { Route, Routes } from 'react-router'

const ClientRoute = () => {
  return (
    <Routes>
        <Route path='/' element = {<ClientLandingPage/>}/>
        <Route path='register' element = {<ClientSignup/>}/>
        <Route path='login' element = {<ClientLogin/>}/>
        <Route path='vendors' element = {<Vendors/>}/>
        <Route path='vendorDetails' element = {<VendorDetails/>}/>

    </Routes>
  )
}

export default ClientRoute