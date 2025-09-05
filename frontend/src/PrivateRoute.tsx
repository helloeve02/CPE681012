import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  type?: "auth" | "reset"; // auth = สำหรับ login ปกติ, reset = สำหรับ reset password flow
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, type }) => {
  const isLogin = localStorage.getItem("isLogin") === "true";
  const canReset = localStorage.getItem("canResetPassword") === "true";
  const location = useLocation();

  if (type === "auth") {
    return isLogin ? <>{children}</> : <Navigate to="/admin" replace />;
  }

  if (type === "reset") {
    return canReset ? <>{children}</> : <Navigate to="/confirm-otp" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
