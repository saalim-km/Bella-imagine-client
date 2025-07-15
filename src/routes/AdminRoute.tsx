import { Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Auth wrappers
import { AuthAdminRoute } from '@/protected/ProtectedRoute'
import { NoAdminAuthRoute } from '@/protected/PublicRoute'

// Fallback UI while loading
const Loading = () => <div className="p-4 text-center">Loading...</div>

// Lazy-loaded pages
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'))
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'))
const UserDetailsPage = lazy(() => import('@/pages/admin/UserDetailsPage'))
const VendorRequestsPage = lazy(() => import('@/pages/admin/VendorRequestPage'))
const CategoryPage = lazy(() => import('@/pages/admin/CategoryPage'))
const AdminWalletPage = lazy(() => import('@/pages/admin/AdminWalletPage'))
const CommunityManagement = lazy(() => import('@/pages/admin/CommunityManagement'))
const CreateCommunityPage = lazy(() => import('@/pages/admin/CreateCommunityPage'))
const EditCommunityPage = lazy(() => import('@/pages/admin/EditCommunity'))
const CommunityMembers = lazy(() => import('@/components/admin/community/CommunityMember'))
const Admin404 = lazy(() => import('@/components/404/Admin404'))

const AdminRoute = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path='/login' element={<NoAdminAuthRoute element={<AdminLogin />} />} />
        <Route path='/dashboard' element={<AuthAdminRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
        <Route path='/users' element={<AuthAdminRoute element={<UsersPage />} allowedRoles={["admin"]} />} />
        <Route path='/vendor-requests' element={<AuthAdminRoute element={<VendorRequestsPage />} allowedRoles={["admin"]} />} />
        <Route path='/categories' element={<AuthAdminRoute element={<CategoryPage />} allowedRoles={["admin"]} />} />
        <Route path='/user/:id/:role' element={<AuthAdminRoute element={<UserDetailsPage />} allowedRoles={["admin"]} />} />
        <Route path='/payments' element={<AuthAdminRoute element={<AdminWalletPage />} allowedRoles={["admin"]} />} />
        <Route path='/community' element={<AuthAdminRoute element={<CommunityManagement />} allowedRoles={["admin"]} />} />
        <Route path='/community/new' element={<AuthAdminRoute element={<CreateCommunityPage />} allowedRoles={["admin"]} />} />
        <Route path='community/edit/r/:slug' element={<AuthAdminRoute element={<EditCommunityPage />} allowedRoles={["admin"]} />} />
        <Route path='r/:slug/members' element={<AuthAdminRoute element={<CommunityMembers />} allowedRoles={["admin"]} />} />
        <Route path='*' element={<Admin404 />} />
      </Routes>
    </Suspense>
  )
}

export default AdminRoute
