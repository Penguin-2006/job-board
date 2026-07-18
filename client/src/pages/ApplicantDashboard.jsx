import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../utils/axios";

const ApplicantDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get("/applications/me");
        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const statusBadge = (status) => {
    switch (status) {
      case "accepted": return "badge badge-green";
      case "rejected": return "badge badge-red";
      case "reviewed": return "badge";
      default: return "badge badge-yellow";
    }
  };

  if (loading) return <div className="empty-state">Loading...</div>;

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Applications</h1>
          <p className="dashboard-subtitle">Welcome, {user.name}</p>
        </div>
        <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p style={{ marginBottom: "16px" }}>You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div>
          {applications.map((app) => (
            <div key={app._id} className="application-row">
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>
                  {app.job.title}
                </h3>
                <p style={{ color: "#4b5563", fontWeight: "500" }}>{app.job.company}</p>
                <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "4px" }}>
                  📍 {app.job.location} • ₹{app.job.salary.toLocaleString()}/mo
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: "8px" }}>
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                <span className={statusBadge(app.status)}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
                <Link
                  to={`/jobs/${app.job._id}`}
                  style={{ color: "#1e40af", fontSize: "0.875rem", fontWeight: "500", textDecoration: "none" }}
                >
                  View Job →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;