import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/DashboardPage'
import UsersPage from '@/pages/admin/UsersPage'
import UserDetailsPage from '@/pages/admin/UserDetailsPage'
import { VendorRequestsPage } from '@/pages/admin/VendorRequestPage'
import { AuthAdminRoute } from '@/protected/ProtectedRoute'
import { NoAdminAuthRoute } from '@/protected/PublicRoute'
import CategoryPage from '@/pages/admin/CategoryPage'
import { Route, Routes } from 'react-router-dom'
import { Admin404 } from '@/components/404/Admin404'
import AdminWalletPage from '@/pages/admin/AdminTransactionsPage'
import CommunityManagement from '@/pages/admin/CommunityManagement'

const AdminRoute = () => {
  return (
    <Routes>
      <Route path='/login' element = {<NoAdminAuthRoute element={<AdminLogin/>}/>}/>
      <Route path='/dashboard' element = {<AuthAdminRoute element={<AdminDashboard/>} allowedRoles={["admin"]}/>}/>
      <Route path='/users' element = {<AuthAdminRoute element={<UsersPage/>} allowedRoles={["admin"]}/>}/>
      <Route path='/vendor-requests' element = {<AuthAdminRoute element={<VendorRequestsPage/>} allowedRoles={["admin"]}/>}/>
      <Route path='/categories' element = {<AuthAdminRoute element={<CategoryPage/>} allowedRoles={["admin"]}/>}/>
      <Route path='/user/:id/:role' element = {<AuthAdminRoute element={<UserDetailsPage/>} allowedRoles={["admin"]}/>}/>
      <Route path='/payments' element = {<AuthAdminRoute element={<AdminWalletPage/>} allowedRoles={["admin"]}/>}/>
      <Route path='/community' element = {<AuthAdminRoute element={<CommunityManagement/>} allowedRoles={["admin"]}/>}/>
      <Route path='*' element={<Admin404/>}/>
    </Routes>
  )
}

export default AdminRoute