import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../utils/axios";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setError("");
    try {
      await axios.post(`/applications/${id}`, {
        resumeUrl: "https://example.com/resume.pdf"
      });
      setApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="empty-state">Loading...</div>;
  if (!job) return <div className="empty-state">Job not found.</div>;

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div className="card">
        {/* Header */}
        <div className="job-detail-header">
          <div>
            <h1 className="job-detail-title">{job.title}</h1>
            <p className="job-detail-company">{job.company}</p>
          </div>
          <span className="badge">{job.jobType}</span>
        </div>

        
        <div className="job-detail-grid">
          <div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Location</p>
            <p style={{ fontWeight: "600" }}>📍 {job.location}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Salary</p>
            <p style={{ fontWeight: "600", color: "#1e40af" }}>
              ₹{job.salary.toLocaleString()}/mo
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Deadline</p>
            <p style={{ fontWeight: "600" }}>
              {new Date(job.deadline).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Posted By</p>
            <p style={{ fontWeight: "600" }}>{job.postedBy?.name}</p>
          </div>
        </div>

        
        <div style={{ marginBottom: "24px" }}>
          <h2 className="section-title">Job Description</h2>
          <p style={{ color: "#4b5563", lineHeight: "1.7" }}>{job.description}</p>
        </div>

        
        <div style={{ marginBottom: "32px" }}>
          <h2 className="section-title">Required Skills</h2>
          <div className="skills-list">
            {job.skills.map((skill, index) => (
              <span key={index} className="badge">{skill}</span>
            ))}
          </div>
        </div>

        
        {user && user.role === "applicant" && (
          <div>
            {error && <div className="error-box">{error}</div>}
            {applied ? (
              <div className="success-box">✅ Application submitted successfully!</div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary"
                style={{ opacity: applying ? 0.5 : 1 }}
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
            )}
          </div>
        )}

        {!user && (
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Please <a href="/login" style={{ color: "#1e40af", fontWeight: "600" }}>login</a> to apply for this job.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDetail;