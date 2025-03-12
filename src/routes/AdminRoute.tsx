import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminLogin from '@/pages/admin/AdminLogin'
import { AuthAdminRoute } from '@/protected/ProtectedRoute'
import { NoAdminAuthRoute } from '@/protected/PublicRoute'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AdminRoute = () => {
  return (
    <Routes>
      <Route path='/login' element = {<NoAdminAuthRoute element={<AdminLogin/>}/>}/>
      <Route path='/dashboard' element = {<AuthAdminRoute element={<AdminDashboard/>} allowedRoles={["admin"]}/>}/>
    </Routes>
  )
}

export default AdminRoute