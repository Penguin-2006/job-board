import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="card">
      <div className="job-card-header">
        <h3 className="job-card-title">{job.title}</h3>
        <span className="badge">{job.jobType}</span>
      </div>

      <p className="company-name">{job.company}</p>
      <p className="location">📍 {job.location}</p>

      <div className="skills-list">
        {job.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>

      <div className="job-card-footer">
        <p className="salary">₹{job.salary.toLocaleString()}/mo</p>
        <Link to={`/jobs/${job._id}`} className="btn-primary">
          View Job
        </Link>
      </div>
    </div>
  );
};

export default JobCard;