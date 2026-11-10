import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { formatDeadline, formatSalary, getErrorMessage } from "../utils/helpers";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const isApplicant = user?.role === "applicant";

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchJob = async () => {
      setLoading(true);
      setNotFound(false);
      setLoadError("");
      try {
        const { data } = await axios.get(`/jobs/${id}`);
        if (!ignore) setJob(data);
      } catch (err) {
        if (ignore) return;
        const status = err.response?.status;
        if (status === 404 || status === 400) {
          setNotFound(true);
        } else {
          setLoadError(getErrorMessage(err, "Could not load this job"));
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchJob();
    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  useEffect(() => {
    setApplied(false);
    if (!isApplicant) return undefined;

    let ignore = false;
    const checkApplied = async () => {
      try {
        const { data } = await axios.get(`/applications/check/${id}`);
        if (!ignore) setApplied(data.applied);
      } catch {
      }
    };
    checkApplied();
    return () => {
      ignore = true;
    };
  }, [id, isApplicant]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError("");
    try {
      await axios.post(`/applications/${id}`, { resumeUrl: resumeUrl.trim() });
      setApplied(true);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to apply"));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="empty-state">Loading...</div>;

  if (loadError) {
    return (
      <div className="page-container">
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
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="empty-state">
        <p className="empty-gap">Job not found.</p>
        <Link to="/jobs" className="btn-primary">Browse jobs</Link>
      </div>
    );
  }

  return (
    <div className="page-container narrow">
      <div className="card">
        <div className="job-detail-header">
          <div>
            <h1 className="job-detail-title">{job.title}</h1>
            <p className="job-detail-company">{job.company}</p>
          </div>
          <span className="badge">{job.jobType}</span>
        </div>

        <div className="job-detail-grid">
          <div>
            <p>Location</p>
            <p>📍 {job.location}</p>
          </div>
          <div>
            <p>Salary</p>
            <p className="salary">{formatSalary(job.salary)}</p>
          </div>
          <div>
            <p>Deadline</p>
            <p>{formatDeadline(job.deadline)}</p>
          </div>
          <div>
            <p>Posted By</p>
            <p>{job.postedBy?.name}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2 className="section-title">Job Description</h2>
          <p className="job-description">{job.description}</p>
        </div>

        <div className="detail-section">
          <h2 className="section-title">Required Skills</h2>
          <div className="skills-list">
            {job.skills.map((skill, index) => (
              <span key={`${skill}-${index}`} className="badge">{skill}</span>
            ))}
          </div>
        </div>

        {isApplicant && (
          <div>
            {error && <div className="error-box">{error}</div>}
            {applied ? (
              <div className="success-box">✅ You have applied for this job.</div>
            ) : job.isClosed ? (
              <div className="error-box">Applications for this job are closed.</div>
            ) : (
              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label htmlFor="resume-url">Resume link</label>
                  <input
                    id="resume-url"
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    required
                    maxLength={2000}
                    className="form-input"
                    placeholder="https://drive.google.com/... (sharing set to anyone with the link)"
                  />
                </div>
                <button type="submit" disabled={applying} className="btn-primary">
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              </form>
            )}
          </div>
        )}

        {user?.role === "company" && (
          <p className="muted-text">You are logged in as a company, so applying is turned off.</p>
        )}

        {!user && (
          <p className="muted-text">
            Please <Link to="/login" className="link-strong">login</Link> to apply for this job.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDetail;