import ClientLandingPage from '@/pages/client/ClientLandingPage'
import React from 'react'
import { Route, Routes } from 'react-router'

const ClientRoute = () => {
  return (
    <Routes>
        <Route path='/' element = {<ClientLandingPage/>}/>
    </Routes>
  )
}

export default ClientRoute