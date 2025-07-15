import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthClientRoute } from "@/protected/ProtectedRoute";
import { NoClientAuthRoute } from "@/protected/PublicRoute";
import { LoadingBar } from "@/components/ui/LoadBar";

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
const CommunityDetailPage = lazy(() => import("@/pages/community/CommunityDetailPage"));
const CreatePostPage = lazy(() => import("@/pages/community/CreatePostPage"));
const VendorDetailsPage = lazy(() => import("@/pages/User/VendorDetailsPage"));
const Communities = lazy(() => import("@/pages/community/Communities"));
const ExplorePage = lazy(() => import("@/pages/community/ExplorePage"));
const PostDetailPage = lazy(() => import("@/pages/community/PostDetailPage"));
const EditPostPage = lazy(() => import("@/pages/community/EditPostPage"));
const Client404 = lazy(() => import("@/components/404/Client404"));

const ClientRoute = () => {
  return (
    <Suspense fallback={<LoadingBar />}>
      <Routes>
        <Route path="/" element={<NoClientAuthRoute element={<ClientLandingPage />} />} />
        <Route path="/home" element={<AuthClientRoute element={<ClientHomePage />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/signup" element={<NoClientAuthRoute element={<ClientSignup />} />} />
        <Route path="/login" element={<NoClientAuthRoute element={<ClientLogin />} />} />
        <Route path="/photographers" element={<AuthClientRoute element={<Vendors />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/profile" element={<AuthClientRoute element={<UserProfile />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/photographer/:id" element={<AuthClientRoute element={<VendorDetailsPage />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/booking/:id/:vendorId" element={<AuthClientRoute element={<BookingServicePage />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/messages" element={<AuthClientRoute element={<ChatPage />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/explore" element={<AuthClientRoute element={<ExplorePage />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/communities" element={<AuthClientRoute element={<Communities />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/community/r/:slug" element={<AuthClientRoute element={<CommunityDetailPage />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/community/submit" element={<AuthClientRoute element={<CreatePostPage />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/post/:postId" element={<AuthClientRoute element={<PostDetailPage />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/post/edit/:postId" element={<AuthClientRoute element={<EditPostPage />} allowedRoles={["client", "vendor"]} />} />
        <Route path="/client/forgot-password" element={<NoClientAuthRoute element={<ForgotPassPage userType="client" />} />} />
        <Route path="*" element={<Client404 />} />
      </Routes>
    </Suspense>
  );
};

export default ClientRoute;
