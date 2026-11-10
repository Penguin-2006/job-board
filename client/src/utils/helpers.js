export const dashboardPath = (role) =>
  role === "company" ? "/dashboard/company" : "/dashboard/applicant";

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. It may be waking up, please try again in a moment.";
  }
  if (!error.response) {
    return "Cannot reach the server. Check your connection and try again.";
  }
  return fallback;
};

export const formatDeadline = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });

export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

export const formatSalary = (value) => `₹${Number(value).toLocaleString("en-IN")}/mo`;

export const todayInIndia = () =>
  new Date(Date.now() + 330 * 60 * 1000).toISOString().slice(0, 10);