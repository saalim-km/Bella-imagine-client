import { Route, Routes } from "react-router-dom";
import ClientHomePage from "@/pages/User/UserHomePage";
import ClientLandingPage from "@/pages/User/UserLandingPage";
import ClientLogin from "@/pages/User/ClientLogin";
import ClientSignup from "@/pages/User/ClientSignup";
import Vendors from "@/pages/User/Vendors";
import { AuthClientRoute } from "@/protected/ProtectedRoute";
import { NoClientAuthRoute } from "@/protected/PublicRoute";
import UserProfile from "@/pages/User/UserProfile";

const ClientRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<NoClientAuthRoute element={<ClientLandingPage/>} />} /> 
      <Route path="/home" element={<AuthClientRoute element={<ClientHomePage />} allowedRoles={["client","vendor"]} />} />
      <Route path="/register" element={<NoClientAuthRoute element={<ClientSignup />} />} />
      <Route path="/login" element={<NoClientAuthRoute element={<ClientLogin />} />} />
      <Route path="/vendors" element={<AuthClientRoute element={<Vendors />} allowedRoles={["client","vendor"]} />} />
      <Route path="/profile" element = {<AuthClientRoute element={<UserProfile/>} allowedRoles={["client","vendor"]}/>}/>
    </Routes>
  );
};

export default ClientRoute;