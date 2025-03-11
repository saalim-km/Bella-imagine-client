import AdminLogin from '@/pages/admin/AdminLogin'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AdminRoute = () => {
  return (
    <Routes>
      <Route path='/login' element = {<AdminLogin/>}/>
    </Routes>
  )
}

export default AdminRoute