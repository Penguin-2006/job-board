import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import JobForm from "../components/JobForm";
import ApplicantRow from "../components/ApplicantRow";
import { emptyJobForm, jobToForm } from "../utils/jobForm";
import { formatDeadline, formatSalary, getErrorMessage } from "../utils/helpers";

const CompanyDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [actionError, setActionError] = useState("");
  const [rowErrors, setRowErrors] = useState({});

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          axios.get("/jobs/mine"),
          axios.get("/applications/received")
        ]);
        if (ignore) return;
        setJobs(jobsResponse.data);
        setApplications(applicationsResponse.data);
      } catch (err) {
        if (!ignore) setLoadError(getErrorMessage(err, "Could not load your dashboard"));
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const applicationsByJob = useMemo(() => {
    const grouped = {};
    applications.forEach((application) => {
      (grouped[application.job] ||= []).push(application);
    });
    return grouped;
  }, [applications]);

  const openForm = (job) => {
    setForm({ job });
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleForm = () => {
    if (form) {
      setForm(null);
    } else {
      openForm(null);
    }
    setFormError("");
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError("");
    try {
      if (form.job) {
        const { data } = await axios.put(`/jobs/${form.job._id}`, payload);
        setJobs((prev) => prev.map((job) => (job._id === data._id ? data : job)));
      } else {
        const { data } = await axios.post("/jobs", payload);
        setJobs((prev) => [data, ...prev]);
      }
      setForm(null);
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to save the job"));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (application, status) => {
    const previous = application.status;
    setRowErrors((prev) => ({ ...prev, [application._id]: "" }));
    setApplications((prev) =>
      prev.map((item) => (item._id === application._id ? { ...item, status } : item))
    );
    try {
      await axios.put(`/applications/${application._id}`, { status });
    } catch (err) {
      setApplications((prev) =>
        prev.map((item) => (item._id === application._id ? { ...item, status: previous } : item))
      );
      setRowErrors((prev) => ({
        ...prev,
        [application._id]: getErrorMessage(err, "Failed to update the status")
      }));
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Delete "${job.title}" and all its applications?`)) return;
    setActionError("");
    try {
      await axios.delete(`/jobs/${job._id}`);
      setJobs((prev) => prev.filter((item) => item._id !== job._id));
      setApplications((prev) => prev.filter((item) => item.job !== job._id));
      if (form?.job?._id === job._id) setForm(null);
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to delete the job"));
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

  const editing = form?.job;
  const formInitialValues = editing
    ? { ...jobToForm(editing), deadline: editing.isClosed ? "" : jobToForm(editing).deadline }
    : emptyJobForm;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Company Dashboard</h1>
          <p className="dashboard-subtitle">Welcome, {user.name}</p>
        </div>
        <button onClick={handleToggleForm} className="btn-primary">
          {form ? "Cancel" : "+ Post a Job"}
        </button>
      </div>

      {actionError && <div className="error-box">{actionError}</div>}

      {form && (
        <JobForm
          key={editing ? editing._id : "new"}
          heading={editing ? "Edit Job" : "Post a New Job"}
          initialValues={formInitialValues}
          submitLabel={editing ? "Save Changes" : "Post Job"}
          submittingLabel={editing ? "Saving..." : "Posting..."}
          submitting={saving}
          error={formError}
          note={editing?.isClosed ? "This job has closed. Choose a new deadline to reopen it." : ""}
          onSubmit={handleSave}
        />
      )}

      {jobs.length === 0 ? (
        <div className="empty-state">
          No jobs posted yet. Click "+ Post a Job" to get started.
        </div>
      ) : (
        <div className="job-admin-list">
          {jobs.map((job) => {
            const jobApplications = applicationsByJob[job._id] || [];
            return (
              <div key={job._id} className="card">
                <div className="job-admin-header">
                  <div>
                    <h3 className="job-admin-title">{job.title}</h3>
                    <p className="job-admin-meta">
                      📍 {job.location} • {formatSalary(job.salary)} • {job.jobType}
                    </p>
                    <p className="job-admin-meta">
                      Deadline: {formatDeadline(job.deadline)}{" "}
                      {job.isClosed && <span className="badge badge-red">Closed</span>}
                    </p>
                  </div>
                  <div className="job-admin-actions">
                    <button onClick={() => openForm(job)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteJob(job)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>

                <h4 className="subheading">Applications ({jobApplications.length})</h4>

                {jobApplications.length === 0 ? (
                  <p className="muted-text">No applications yet.</p>
                ) : (
                  <div>
                    {jobApplications.map((application) => (
                      <ApplicantRow
                        key={application._id}
                        application={application}
                        onStatusChange={handleStatusChange}
                        error={rowErrors[application._id]}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;