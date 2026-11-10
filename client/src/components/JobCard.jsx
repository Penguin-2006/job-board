import { Link } from "react-router-dom";
import { formatDeadline, formatSalary } from "../utils/helpers";

const JobCard = ({ job }) => {
  const extraSkills = job.skills.length - 3;

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
          <span key={`${skill}-${index}`} className="skill-tag">{skill}</span>
        ))}
        {extraSkills > 0 && <span className="skill-tag">+{extraSkills} more</span>}
      </div>

      <p className="deadline-text">Apply by {formatDeadline(job.deadline)}</p>

      <div className="job-card-footer">
        <p className="salary">{formatSalary(job.salary)}</p>
        <Link to={`/jobs/${job._id}`} className="btn-primary">
          View Job
        </Link>
      </div>
    </div>
  );
};

export default JobCard;