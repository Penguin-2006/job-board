import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">JobBoard</Link>

      <div className="navbar-links">
        <Link to="/jobs">Browse Jobs</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-accent">Register</Link>
          </>
        ) : (
          <>
            <Link to={user.role === "company" ? "/dashboard/company" : "/dashboard/applicant"}>
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn-accent">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;