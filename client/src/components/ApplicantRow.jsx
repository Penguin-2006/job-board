import StatusBadge from "./StatusBadge";

const STATUS_OPTIONS = ["pending", "reviewed", "accepted", "rejected"];

const ApplicantRow = ({ application, onStatusChange, error }) => {
  const name = application.applicant?.name || "Unknown applicant";

  return (
    <div>
      <div className="applicant-row">
        <div>
          <p className="applicant-name">{name}</p>
          <p className="applicant-email">{application.applicant?.email}</p>
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-subtle"
          >
            View resume
          </a>
        </div>
        <div className="applicant-actions">
          <StatusBadge status={application.status} />
          <select
            value={application.status}
            onChange={(e) => onStatusChange(application, e.target.value)}
            className="select-input"
            aria-label={`Status for ${name}`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="row-error">{error}</p>}
    </div>
  );
};

export default ApplicantRow;