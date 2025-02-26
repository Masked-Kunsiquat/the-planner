import { Navigate, Outlet } from "react-router-dom";
import { AuthAPI } from "../lib/api";

const ProtectedRoute = () => {
  const isAuthenticated = AuthAPI.isAuthenticated();

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;