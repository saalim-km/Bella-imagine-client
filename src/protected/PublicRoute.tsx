import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { JSX } from "react";

interface NoAuthRouteProps {
  element: JSX.Element;
}

export const NoClientAuthRoute = ({ element }: NoAuthRouteProps) => {
  const user  = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor.role;
    if (state.client.client) return state.client.client.role;
    return null;
  });

  if (user) {
    return <Navigate to="/home" />; // Redirecting authenticated clients to home instead of landing
  }

  return element;
};

// export const NoAdminAuthRoute = ({ element }: NoAuthRouteProps) => {
//   const user = useSelector((state: RootState) => state.admin.admin);

//   if (user && user?.role !== "admin") {
//     return <Navigate to={"/unauthorized"} />;
//   }

//   if (user) {
//     return <Navigate to="/admin/ad_pvt" />;
//   }

//   return element;
// };

// export const NoVendorAuthRoute = ({ element }: NoAuthRouteProps) => {
//   const user = useSelector((state: RootState) => state.vendor.vendor);

//   if (user && user?.role !== "vendor") {
//     return <Navigate to={"/unauthorized"} />;
//   }

//   if (user) {
//     return <Navigate to="/vendor/profile" />;
//   }

//   return element;
// };