const CLASSES = {
  accepted: "badge badge-green",
  rejected: "badge badge-red",
  reviewed: "badge",
  pending: "badge badge-yellow"
};

const StatusBadge = ({ status }) => (
  <span className={CLASSES[status] || "badge"}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default StatusBadge;