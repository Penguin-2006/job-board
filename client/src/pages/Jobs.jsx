import { useState, useEffect } from "react";
import axios from "../utils/axios";
import JobCard from "../components/JobCard";

const emptyFilters = { search: "", location: "", jobType: "", skills: "" };

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);

  const fetchJobs = async (activeFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value.trim()) params.append(key, value.trim());
      });
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

  const handleClear = () => {
    setFilters(emptyFilters);
    fetchJobs(emptyFilters);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Browse Jobs</h1>

      <form onSubmit={handleSearch} className="filters">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Title, company or keyword"
          className="form-input"
          style={{ flex: 2, minWidth: "200px" }}
        />
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
          placeholder="Skills (e.g. React, Node)"
          className="form-input"
          style={{ flex: 1, minWidth: "160px" }}
        />
        <button type="submit" className="btn-primary">Search</button>
        <button
          type="button"
          onClick={handleClear}
          className="btn-primary"
          style={{ backgroundColor: "#6b7280" }}
        >
          Clear
        </button>
      </form>

      {loading ? (
        <div className="empty-state">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">No jobs match your search.</div>
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