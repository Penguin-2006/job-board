import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import axios from "../utils/axios";
import { getErrorMessage } from "../utils/helpers";
import useSlowNotice from "../hooks/useSlowNotice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
    company: ""
  });
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
      const { data } = await axios.post("/auth/register", formData);
      dispatch(loginSuccess(data));
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"));
      setLoading(false);
    }
  };

  return (
    <div className="form-center">
      <div className="form-container">
        <h2 className="form-title">Create an Account</h2>

        {error && <div className="error-box">{error}</div>}
        {slow && (
          <div className="notice-box">
            The server is waking up (free hosting). This can take up to a minute, thanks for waiting.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={80}
              autoComplete="name"
              className="form-input"
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              className="form-input"
              placeholder="••••••••"
            />
            <p className="field-hint">At least 8 characters.</p>
          </div>

          <div className="form-group">
            <label htmlFor="register-role">I am a</label>
            <select
              id="register-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="applicant">Job Seeker</option>
              <option value="company">Company / Recruiter</option>
            </select>
          </div>

          {formData.role === "company" && (
            <div className="form-group">
              <label htmlFor="register-company">Company Name</label>
              <input
                id="register-company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                maxLength={100}
                className="form-input"
                placeholder="Tech Corp"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-block"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;