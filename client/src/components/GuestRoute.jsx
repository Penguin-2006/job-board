import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { dashboardPath } from "../utils/helpers";

const GuestRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (user) {
    return <Navigate to={location.state?.from || dashboardPath(user.role)} replace />;
  }

  return children;
};

export default GuestRoute;