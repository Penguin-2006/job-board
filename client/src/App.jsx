import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import CompanyDashboard from "./pages/CompanyDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import axios, { API_URL } from "./utils/axios";

function App() {
  const { user } = useSelector((state) => state.auth);
  const token = user?.token;

  useEffect(() => {
    axios.get("/", { baseURL: API_URL.replace(/\/api\/?$/, "") }).catch(() => {});
  }, []);

  useEffect(() => {
    if (token) axios.get("/auth/me").catch(() => {});
  }, [token]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        } />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/dashboard/company" element={
          <ProtectedRoute role="company">
            <CompanyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/applicant" element={
          <ProtectedRoute role="applicant">
            <ApplicantDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;