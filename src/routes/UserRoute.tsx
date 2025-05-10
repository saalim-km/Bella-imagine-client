import { Route, Routes } from "react-router-dom";
import ClientHomePage from "@/pages/User/UserHomePage";
import ClientLandingPage from "@/pages/User/UserLandingPage";
import ClientLogin from "@/pages/User/ClientLogin";
import ClientSignup from "@/pages/User/ClientSignup";
import Vendors from "@/pages/User/Vendors";
import { AuthClientRoute } from "@/protected/ProtectedRoute";
import { NoClientAuthRoute } from "@/protected/PublicRoute";
import UserProfile from "@/pages/User/UserProfile";
import ForgotPassPage from "@/pages/User/ForgotPassPage";
import { Client404 } from "@/components/404/Client404";
import VendorDetails from "@/pages/User/VendorDetailsPage";
import BookingServicePage from "@/pages/User/BookingServicePage";
import ChatPage from "@/pages/chat/ChatPage";
import CommunityHomePage from "@/pages/community-contest/CommunityHomePage";
import CommunityDetailPage from "@/pages/community-contest/CommunityDetailPage";
import CreatePostPage from "@/pages/community-contest/CreatePostPage";

const ClientRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<NoClientAuthRoute element={<ClientLandingPage/>} />} /> 
      <Route path="/home" element={<AuthClientRoute element={<ClientHomePage />} allowedRoles={["client","vendor"]} />} />
      <Route path="/register" element={<NoClientAuthRoute element={<ClientSignup />} />} />
      <Route path="/login" element={<NoClientAuthRoute element={<ClientLogin />} />} />
      <Route path="/vendors" element={<AuthClientRoute element={<Vendors />} allowedRoles={["client","vendor"]} />} />
      <Route path="/profile" element = {<AuthClientRoute element={<UserProfile/>} allowedRoles={["client","vendor"]}/>}/>
      <Route path="/photographer/:id" element = {<AuthClientRoute element={<VendorDetails/>} allowedRoles={["client","vendor"]}/>}/>
      <Route path="/booking/:id/:vendorId" element = {<AuthClientRoute element={<BookingServicePage/>} allowedRoles={["client","vendor"]}/>}/>
      <Route path="/messages" element = {<AuthClientRoute element={<ChatPage/>} allowedRoles={["client","vendor"]}/>}/>
      <Route path="/community" element = {<AuthClientRoute element={<CommunityHomePage/>} allowedRoles={["client","vendor"]}/>}/>
      <Route path="/community/r/:slug" element = {<AuthClientRoute element={<CommunityDetailPage/>} allowedRoles={["client","vendor"]}/>}/>
      <Route path="/community/post/r/:slug" element = {<AuthClientRoute element={<CreatePostPage/>} allowedRoles={["client","vendor"]}/>}/>


      <Route path="/client/forgot-password" element = {<NoClientAuthRoute element={<ForgotPassPage userType="client"/>}/>}/>
      <Route path="*" element = {<Client404/>}/>
    </Routes> 
  );
};

export default ClientRoute;