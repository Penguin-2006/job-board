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