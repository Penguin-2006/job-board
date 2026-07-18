import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import CompanyDashboard from "./pages/CompanyDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
      </Routes>
    </>
  );
}

export default App;