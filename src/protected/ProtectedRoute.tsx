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



export const AuthAdminRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const user  = useSelector((state: RootState) => {
    if (state.admin.admin) return state.admin.admin?.role;
    return null;
  });
  console.log('got admin in authadminroute',user);

  if (!user) {
    return <Navigate to="/admin/login" />; 
  }

  return allowedRoles.includes(user) ? element : <Navigate to="/unauthorized" />;
};