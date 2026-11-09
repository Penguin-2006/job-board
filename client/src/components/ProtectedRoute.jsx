import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { dashboardPath } from "../utils/helpers";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;