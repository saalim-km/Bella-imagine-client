import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/DashboardPage'
import UsersPage from '@/pages/admin/UsersPage'
import { VendorRequestsPage } from '@/pages/admin/VendorRequestPage'
import { AuthAdminRoute } from '@/protected/ProtectedRoute'
import { NoAdminAuthRoute } from '@/protected/PublicRoute'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AdminRoute = () => {
  return (
    <Routes>
      <Route path='/login' element = {<NoAdminAuthRoute element={<AdminLogin/>}/>}/>
      <Route path='/dashboard' element = {<AuthAdminRoute element={<AdminDashboard/>} allowedRoles={["admin"]}/>}/>
      <Route path='/users' element = {<AuthAdminRoute element={<UsersPage/>} allowedRoles={["admin"]}/>}/>
      <Route path='/vendor-requests' element = {<AuthAdminRoute element={<VendorRequestsPage/>} allowedRoles={["admin"]}/>}/>

    </Routes>
  )
}

export default AdminRoute