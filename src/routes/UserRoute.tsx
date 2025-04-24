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
import CommunityPage from "@/pages/User/contest_community/CommunityPage";
import ContestsPage from "@/pages/User/contest_community/ContestsPage";
import UploadPage from "@/pages/User/contest_community/UploadPage";
import ChatPage from "@/pages/chat/ChatPage";

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
      <Route path="/community" element = {<AuthClientRoute element={<CommunityPage/>} allowedRoles={["client","vendor"]}/>}/>
      <Route path="/contests" element = {<AuthClientRoute element={<ContestsPage/>} allowedRoles={["client","vendor"]}/>}/>
      <Route path="/contest/upload" element = {<AuthClientRoute element={<UploadPage/>} allowedRoles={["client","vendor"]}/>}/>
      <Route path="/messages" element = {<AuthClientRoute element={<ChatPage/>} allowedRoles={["client","vendor"]}/>}/>

      <Route path="/client/forgot-password" element = {<NoClientAuthRoute element={<ForgotPassPage userType="client"/>}/>}/>
      <Route path="*" element = {<Client404/>}/>
    </Routes>
  );
};

export default ClientRoute;