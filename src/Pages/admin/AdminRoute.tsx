import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true"; 

  return isAdmin ? children : <Navigate to="/admin_login" />;
};

export default AdminRoute;
