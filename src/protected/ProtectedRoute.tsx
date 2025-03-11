import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { JSX } from "react";

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

export const AuthClientRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const user  = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor.role;
    if (state.client.client) return state.client.client.role;
    return null;
  });

  if (!user) {
    return <Navigate to="/login" />; 
  }

  return allowedRoles.includes(user) ? element : <Navigate to="/unauthorized" />;
};

// export const AuthAdminRoute = ({
//   element,
//   allowedRoles,
// }: ProtectedRouteProps) => {
//   const userRole = useSelector((state: RootState) => state.admin.admin?.role);
//   console.log(userRole);
//   if (!userRole) {
//     return <Navigate to="/admin" />;
//   }

//   return allowedRoles.includes(userRole) ? (
//     element
//   ) : (
//     <Navigate to="/unauthorized" />
//   );
// };

// export const AuthVendorRoute = ({
//   element,
//   allowedRoles,
// }: ProtectedRouteProps) => {
//   const userRole = useSelector((state: RootState) => state.vendor.vendor?.role);
//   console.log(userRole);
//   if (!userRole) {
//     return <Navigate to="/vendor" />;
//   }

//   return allowedRoles.includes(userRole) ? (
//     element
//   ) : (
//     <Navigate to="/unauthorized" />
//   );
// };