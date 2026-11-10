import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../utils/axios";
import JobCard from "../components/JobCard";
import { getErrorMessage } from "../utils/helpers";

const PAGE_SIZE = 12;
const FILTER_KEYS = ["search", "location", "jobType", "skills"];
const emptyFilters = { search: "", location: "", jobType: "", skills: "" };

const readFilters = (params) => ({
  search: params.get("search") || "",
  location: params.get("location") || "",
  jobType: params.get("jobType") || "",
  skills: params.get("skills") || ""
});

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.toString();
  const page = Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1);

  const [filters, setFilters] = useState(() => readFilters(searchParams));
  const [jobs, setJobs] = useState([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setFilters(readFilters(new URLSearchParams(query)));
  }, [query]);

  useEffect(() => {
    let ignore = false;

    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams(query);
        params.set("page", String(page));
        params.set("limit", String(PAGE_SIZE));
        const { data } = await axios.get(`/jobs?${params.toString()}`);
        if (ignore) return;
        setJobs(data.jobs);
        setPages(data.pages);
        setTotal(data.total);
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err, "Could not load jobs"));
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      ignore = true;
    };
  }, [query, page, reloadKey]);

  const goTo = (next, nextPage) => {
    const params = new URLSearchParams();
    FILTER_KEYS.forEach((key) => {
      const value = (next[key] || "").trim();
      if (value) params.set(key, value);
    });
    if (nextPage > 1) params.set("page", String(nextPage));
    setSearchParams(params);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    goTo(filters, 1);
  };

  const handleClear = () => {
    setFilters(emptyFilters);
    setSearchParams({});
  };

  const handlePage = (nextPage) => {
    goTo(readFilters(searchParams), nextPage);
    window.scrollTo({ top: 0 });
  };

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = from + jobs.length - 1;

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
          aria-label="Search by title, company or keyword"
          className="form-input grow-2"
        />
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Location"
          aria-label="Location"
          className="form-input grow-1"
        />
        <select
          name="jobType"
          value={filters.jobType}
          onChange={handleFilterChange}
          aria-label="Job type"
          className="form-input grow-1"
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
          aria-label="Skills, separated by commas"
          className="form-input grow-1"
        />
        <button type="submit" className="btn-primary">Search</button>
        <button type="button" onClick={handleClear} className="btn-primary btn-secondary">
          Clear
        </button>
      </form>

      {error ? (
        <div className="error-box">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-primary error-actions"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="empty-state">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          {page > 1 ? (
            <>
              <p className="empty-gap">There are no jobs on this page.</p>
              <button type="button" onClick={() => handlePage(1)} className="btn-primary">
                Back to the first page
              </button>
            </>
          ) : (
            "No jobs match your search."
          )}
        </div>
      ) : (
        <>
          <p className="results-summary">
            Showing {from}-{to} of {total} {total === 1 ? "job" : "jobs"}
          </p>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
          {pages > 1 && (
            <div className="pagination">
              <button
                type="button"
                onClick={() => handlePage(page - 1)}
                disabled={page <= 1}
                className="btn-primary"
              >
                Previous
              </button>
              <span>Page {page} of {pages}</span>
              <button
                type="button"
                onClick={() => handlePage(page + 1)}
                disabled={page >= pages}
                className="btn-primary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;