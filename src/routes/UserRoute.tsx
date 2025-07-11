import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthClientRoute } from "@/protected/ProtectedRoute";
import { NoClientAuthRoute } from "@/protected/PublicRoute";
import { Client404 } from "@/components/404/Client404";
import { Spinner } from "@/components/ui/spinner";

// Lazy load all components
const ClientHomePage = lazy(() => import("@/pages/User/UserHomePage"));
const ClientLandingPage = lazy(() => import("@/pages/User/UserLandingPage"));
const ClientLogin = lazy(() => import("@/pages/User/ClientLogin"));
const ClientSignup = lazy(() => import("@/pages/User/ClientSignup"));
const Vendors = lazy(() => import("@/pages/User/Vendors"));
const UserProfile = lazy(() => import("@/pages/User/UserProfile"));
const ForgotPassPage = lazy(() => import("@/pages/User/ForgotPassPage"));
const BookingServicePage = lazy(() => import("@/pages/User/BookingServicePage"));
const ChatPage = lazy(() => import("@/pages/chat/ChatPage"));
const CommunityHomePage = lazy(() => import("@/pages/community-contest/CommunityHomePage"));
const CommunityDetailPage = lazy(() => import("@/pages/community-contest/CommunityDetailPage"));
const CreatePostPage = lazy(() => import("@/pages/community-contest/CreatePostPage"));
const VendorDetailsPage = lazy(() => import("@/pages/User/VendorDetailsPage"));
const Communities = lazy(() => import("@/pages/community-contest/Communities"));

const ClientRoute = () => {
  return (
    <Suspense fallback={<Spinner/>}>
      <Routes>
        <Route path="/" element={<NoClientAuthRoute element={<ClientLandingPage/>} />} /> 
        <Route path="/home" element={<AuthClientRoute element={<ClientHomePage />} allowedRoles={["client","vendor"]} />} />
        <Route path="/register" element={<NoClientAuthRoute element={<ClientSignup />} />} />
        <Route path="/login" element={<NoClientAuthRoute element={<ClientLogin />} />} />
        <Route path="/vendors" element={<AuthClientRoute element={<Vendors />} allowedRoles={["client","vendor"]} />} />
        <Route path="/profile" element = {<AuthClientRoute element={<UserProfile/>} allowedRoles={["client","vendor"]}/>}/>
        <Route path="/photographer/:id" element = {<AuthClientRoute element={<VendorDetailsPage/>} allowedRoles={["client","vendor"]}/>}/>
        <Route path="/booking/:id/:vendorId" element = {<AuthClientRoute element={<BookingServicePage/>} allowedRoles={["client","vendor"]}/>}/>
        <Route path="/messages" element = {<AuthClientRoute element={<ChatPage/>} allowedRoles={["client","vendor"]}/>}/>
        <Route path="/explore" element = {<AuthClientRoute element={<CommunityHomePage/>} allowedRoles={["client","vendor"]}/>}/>
        <Route path="/communities" element = {<AuthClientRoute element={<Communities/>} allowedRoles={['client']}/>}/>
        <Route path="/community/r/:slug" element = {<AuthClientRoute element={<CommunityDetailPage/>} allowedRoles={["client","vendor"]}/>}/>
        <Route path="/community/post/r/:slug" element = {<AuthClientRoute element={<CreatePostPage/>} allowedRoles={["client","vendor"]}/>}/>
        <Route path="/client/forgot-password" element = {<NoClientAuthRoute element={<ForgotPassPage userType="client"/>}/>}/>
        <Route path="*" element = {<Client404/>}/>
      </Routes> 
    </Suspense>
  );
};

export default ClientRoute;