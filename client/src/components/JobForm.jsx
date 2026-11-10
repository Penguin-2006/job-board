import { useState } from "react";
import { formToPayload } from "../utils/jobForm";
import { todayInIndia } from "../utils/helpers";

const JobForm = ({
  heading,
  initialValues,
  submitLabel,
  submittingLabel,
  submitting,
  error,
  note,
  onSubmit
}) => {
  const [formData, setFormData] = useState(initialValues);
  const today = todayInIndia();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formToPayload(formData));
  };

  return (
    <div className="card form-card">
      <h2 className="section-title">{heading}</h2>
      {note && <div className="notice-box">{note}</div>}
      {error && <div className="error-box">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="job-title">Job Title</label>
            <input
              id="job-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={120}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="job-location">Location</label>
            <input
              id="job-location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              maxLength={120}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="job-salary">Salary (₹ per month)</label>
            <input
              id="job-salary"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              min="0"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="job-type">Job Type</label>
            <select
              id="job-type"
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
            <label htmlFor="job-skills">Skills (comma separated)</label>
            <input
              id="job-skills"
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              required
              className="form-input"
            />
            <p className="field-hint">Up to 20 skills.</p>
          </div>
          <div className="form-group">
            <label htmlFor="job-deadline">Application Deadline</label>
            <input
              id="job-deadline"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={today}
              required
              className="form-input"
            />
            <p className="field-hint">Applications stay open until the end of this day (India time).</p>
          </div>
          <div className="form-group col-span-2">
            <label htmlFor="job-description">Job Description</label>
            <textarea
              id="job-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              maxLength={5000}
              className="form-input"
            />
          </div>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? submittingLabel : submitLabel}
        </button>
      </form>
    </div>
  );
};

export default JobForm;