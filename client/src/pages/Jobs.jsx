import { useState, useEffect } from "react";
import axios from "../utils/axios";
import JobCard from "../components/JobCard";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    skills: ""
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.location) params.append("location", filters.location);
      if (filters.jobType) params.append("jobType", filters.jobType);
      if (filters.skills) params.append("skills", filters.skills);

      const { data } = await axios.get(`/jobs?${params.toString()}`);
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Browse Jobs</h1>

      <form onSubmit={handleSearch} className="filters">
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Location"
          className="form-input"
          style={{ flex: 1, minWidth: "160px" }}
        />
        <select
          name="jobType"
          value={filters.jobType}
          onChange={handleFilterChange}
          className="form-input"
          style={{ flex: 1, minWidth: "160px" }}
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>
        <input
          type="text"
          name="skills"
          value={filters.skills}
          onChange={handleFilterChange}
          placeholder="Skills (e.g. React,Node)"
          className="form-input"
          style={{ flex: 1, minWidth: "160px" }}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading ? (
        <div className="empty-state">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">No jobs found.</div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;