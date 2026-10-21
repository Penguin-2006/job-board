import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="hero">
        <h1>Find Your Dream Job</h1>
        <p>Connect with top companies and opportunities that match your skills and ambitions.</p>
        <div className="hero-buttons">
          <Link to="/jobs" className="btn-accent">Browse Jobs</Link>
          <Link to="/register" className="btn-outline">Post a Job</Link>
        </div>
      </div>

      <div className="cta">
        <h2>Are you hiring?</h2>
        <p>Post your job openings and find the best talent from across the country.</p>
        <Link to="/register" className="btn-accent">Get Started</Link>
      </div>
    </div>
  );
};

export default Home;