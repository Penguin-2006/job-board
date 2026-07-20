import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../utils/axios";

const CompanyDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skills: "",
    jobType: "full-time",
    deadline: ""
  });

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get("/jobs");
      const myJobs = data.filter((job) => job.postedBy._id === user._id);
      setJobs(myJobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const { data } = await axios.get(`/applications/job/${jobId}`);
      setApplications((prev) => ({ ...prev, [jobId]: data }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    jobs.forEach((job) => fetchApplications(job._id));
  }, [jobs]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/jobs", {
        ...formData,
        salary: Number(formData.salary),
        skills: formData.skills.split(",").map((s) => s.trim())
      });
      setShowForm(false);
      setFormData({
        title: "", description: "", location: "",
        salary: "", skills: "", jobType: "full-time", deadline: ""
      });
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (applicationId, status, jobId) => {
    try {
      await axios.put(`/applications/${applicationId}`, { status });
      fetchApplications(jobId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`/jobs/${jobId}`);
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="empty-state">Loading...</div>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Company Dashboard</h1>
          <p className="dashboard-subtitle">Welcome, {user.name}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "+ Post a Job"}
        </button>
      </div>

      
      {showForm && (
        <div className="card" style={{ marginBottom: "32px" }}>
          <h2 className="section-title">Post a New Job</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Salary (per month)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group col-span-2">
                <label>Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="form-input"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "8px" }}
            >
              Post Job
            </button>
          </form>
        </div>
      )}

      
      {jobs.length === 0 ? (
        <div className="empty-state">
          No jobs posted yet. Click "+ Post a Job" to get started.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a" }}>
                    {job.title}
                  </h3>
                  <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "4px" }}>
                    📍 {job.location} • ₹{job.salary.toLocaleString()}/mo • {job.jobType}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>

              <h4 style={{ fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
                Applications ({applications[job._id]?.length || 0})
              </h4>

              {applications[job._id]?.length === 0 ? (
                <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>No applications yet.</p>
              ) : (
                <div>
                  {applications[job._id]?.map((app) => (
                    <div key={app._id} className="applicant-row">
                      <div>
                        <p style={{ fontWeight: "500", color: "#0f172a" }}>{app.applicant.name}</p>
                        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{app.applicant.email}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span className={`badge ${
                          app.status === "accepted" ? "badge-green" :
                          app.status === "rejected" ? "badge-red" :
                          app.status === "reviewed" ? "" :
                          "badge-yellow"
                        }`}>
                          {app.status}
                        </span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusUpdate(app._id, e.target.value, job._id)}
                          className="select-input"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;