import { Route, Routes } from "react-router-dom";
import ClientHomePage from "@/pages/client/ClientHomePage";
import ClientLandingPage from "@/pages/client/ClientLandingPage";
import ClientLogin from "@/pages/client/ClientLogin";
import ClientSignup from "@/pages/client/ClientSignup";
import Vendors from "@/pages/client/Vendors";
import { AuthClientRoute } from "@/protected/ProtectedRoute";
import { NoClientAuthRoute } from "@/protected/PublicRoute";

const ClientRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<NoClientAuthRoute element={<ClientLandingPage/>} />} /> 
      <Route path="/home" element={<AuthClientRoute element={<ClientHomePage />} allowedRoles={["client"]} />} />
      <Route path="/register" element={<NoClientAuthRoute element={<ClientSignup />} />} />
      <Route path="/login" element={<NoClientAuthRoute element={<ClientLogin />} />} />
      <Route path="/vendors" element={<AuthClientRoute element={<Vendors />} allowedRoles={["client"]} />} />
    </Routes>
  );
};

export default ClientRoute;
