import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import StatusBadge from "../components/StatusBadge";
import { formatDate, formatSalary, getErrorMessage } from "../utils/helpers";

const ApplicantDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchApplications = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const { data } = await axios.get("/applications/me");
        if (!ignore) setApplications(data);
      } catch (err) {
        if (!ignore) setLoadError(getErrorMessage(err, "Could not load your applications"));
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchApplications();
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const handleWithdraw = async (application) => {
    if (!window.confirm(`Withdraw your application for "${application.job.title}"?`)) return;
    setActionError("");
    try {
      await axios.delete(`/applications/${application._id}`);
      setApplications((prev) => prev.filter((item) => item._id !== application._id));
    } catch (err) {
      setActionError(getErrorMessage(err, "Could not withdraw this application"));
    }
  };

  if (loading) return <div className="empty-state">Loading...</div>;

  return (
    <div className="page-container narrow">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Applications</h1>
          <p className="dashboard-subtitle">Welcome, {user.name}</p>
        </div>
        <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
      </div>

      {actionError && <div className="error-box">{actionError}</div>}

      {loadError ? (
        <div className="error-box">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-primary error-actions"
          >
            Try again
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <p className="empty-gap">You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div>
          {applications.map((app) => (
            <div key={app._id} className="application-row">
              <div>
                <h3 className="application-title">{app.job.title}</h3>
                <p className="application-company">{app.job.company}</p>
                <p className="application-meta">
                  📍 {app.job.location} • {formatSalary(app.job.salary)}
                </p>
                <p className="application-date">Applied on {formatDate(app.createdAt)}</p>
              </div>
              <div className="application-side">
                <StatusBadge status={app.status} />
                <Link to={`/jobs/${app.job._id}`} className="link-subtle">
                  View Job →
                </Link>
                {(app.status === "pending" || app.status === "reviewed") && (
                  <button
                    type="button"
                    onClick={() => handleWithdraw(app)}
                    className="delete-btn"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;