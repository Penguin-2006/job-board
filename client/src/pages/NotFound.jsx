import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="page-container">
      <div className="empty-state">
        <h1 className="page-title">Page not found</h1>
        <p style={{ marginBottom: "24px" }}>The page you are looking for does not exist or was moved.</p>
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>
    </div>
  );
};

export default NotFound;