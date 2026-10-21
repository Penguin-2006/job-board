import Application from "../models/Application.js";
import Job from "../models/Job.js";
import handleError from "../utils/handleError.js";

const STATUSES = ["pending", "reviewed", "accepted", "rejected"];

export const applyForJob = async (req, res) => {
  try {
    const resumeUrl = req.body && req.body.resumeUrl;
    if (typeof resumeUrl !== "string" || !/^https?:\/\//i.test(resumeUrl.trim())) {
      return res.status(400).json({ message: "A valid resume link is required" });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const closesAt = new Date(job.deadline);
    closesAt.setUTCHours(23, 59, 59, 999);
    if (closesAt < new Date()) {
      return res.status(400).json({ message: "Applications for this job are closed" });
    }

    const alreadyApplied = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resumeUrl: resumeUrl.trim()
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already applied for this job" });
    }
    handleError(res, error);
  }
};

export const getApplicationsByJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    handleError(res, error);
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location salary")
      .sort({ createdAt: -1 });

    res.json(applications.filter((application) => application.job));
  } catch (error) {
    handleError(res, error);
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const status = req.body && req.body.status;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (!application.job) {
      return res.status(404).json({ message: "Job no longer exists" });
    }

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    handleError(res, error);
  }
};