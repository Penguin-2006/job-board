export const emptyJobForm = {
  title: "",
  description: "",
  location: "",
  salary: "",
  skills: "",
  jobType: "full-time",
  deadline: ""
};

export const jobToForm = (job) => ({
  title: job.title,
  description: job.description,
  location: job.location,
  salary: String(job.salary),
  skills: (job.skills || []).join(", "),
  jobType: job.jobType,
  deadline: job.deadline ? job.deadline.slice(0, 10) : ""
});

export const formToPayload = (form) => ({
  title: form.title.trim(),
  description: form.description.trim(),
  location: form.location.trim(),
  salary: Number(form.salary),
  skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
  jobType: form.jobType,
  deadline: form.deadline
});