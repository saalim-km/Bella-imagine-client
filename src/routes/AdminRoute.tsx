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
import CommunityManagement from '@/pages/admin/CommunityManagement'
import CreateCommunityPage from '@/pages/admin/CreateCommunityPage'
import EditCommunityPage from '@/pages/admin/EditCommunity'
import CommunityMembers from '@/components/admin/community_contest/CommunityMember'
import AdminWalletPage from '@/pages/admin/AdminWalletPage'

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
      <Route path='/community/new' element = {<AuthAdminRoute element={<CreateCommunityPage/>} allowedRoles={["admin"]}/>}/>
      <Route path='community/edit/r/:slug' element = {<AuthAdminRoute element={<EditCommunityPage/>} allowedRoles={["admin"]}/>}/>
      <Route path='r/:slug/members' element = {<AuthAdminRoute element={<CommunityMembers/>} allowedRoles={["admin"]}/>}/>
      <Route path='*' element={<Admin404/>}/>
    </Routes>
  )
}

export default AdminRoute