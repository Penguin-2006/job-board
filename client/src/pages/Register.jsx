import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFail } from "../redux/authSlice";
import axios from "../utils/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
    company: ""
  });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await axios.post("/auth/register", formData);
      dispatch(loginSuccess(data));
      if (data.role === "company") {
        navigate("/dashboard/company");
      } else {
        navigate("/dashboard/applicant");
      }
    } catch (err) {
      dispatch(loginFail(err.response?.data?.message || "Registration failed"));
    }
  };

  return (
    <div className="form-center">
      <div className="form-container">
        <h2 className="form-title">Create an Account</h2>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label>I am a</label>
            <select
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
              <label>Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Tech Corp"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", marginTop: "8px" }}
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