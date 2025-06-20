import { Spinner } from "@/components/ui/spinner";
import { NoClientAuthRoute } from "@/protected/PublicRoute";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const VendorLoginPage = lazy(() => import("@/pages/vendor/VendorLogin"));
const VendorSignupPage = lazy(() => import("@/pages/vendor/VendorSignup"));
const ForgotPassPage = lazy(() => import("@/pages/User/ForgotPassPage"));

const VendorRoute = () => {
  return (
    <Suspense fallback = {<Spinner/>}>
      <Routes>
        <Route
          path="/login"
          element={<NoClientAuthRoute element={<VendorLoginPage />} />}
        />
        <Route
          path="/signup"
          element={<NoClientAuthRoute element={<VendorSignupPage />} />}
        />
        <Route
          path="/forgot-password"
          element={
            <NoClientAuthRoute element={<ForgotPassPage userType="vendor" />} />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default VendorRoute;
