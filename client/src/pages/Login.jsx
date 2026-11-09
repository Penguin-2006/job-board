import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import axios from "../utils/axios";
import { getErrorMessage } from "../utils/helpers";
import useSlowNotice from "../hooks/useSlowNotice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const slow = useSlowNotice(loading);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/auth/login", formData);
      dispatch(loginSuccess(data));
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
      setLoading(false);
    }
  };

  return (
    <div className="form-center">
      <div className="form-container">
        <h2 className="form-title">Welcome Back</h2>

        {error && <div className="error-box">{error}</div>}
        {slow && (
          <div className="notice-box">
            The server is waking up (free hosting). This can take up to a minute, thanks for waiting.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-block"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="form-footer">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;