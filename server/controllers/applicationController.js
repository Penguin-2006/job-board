import Application from "../models/Application.js";
import Job from "../models/Job.js";
import handleError from "../utils/handleError.js";
import { isHttpUrl } from "../utils/url.js";
import { isClosed } from "../utils/deadline.js";

const STATUSES = ["pending", "reviewed", "accepted", "rejected"];

export const applyForJob = async (req, res) => {
  try {
    const resumeUrl = req.body && req.body.resumeUrl;
    if (!isHttpUrl(resumeUrl)) {
      return res.status(400).json({ message: "A valid resume link is required" });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (isClosed(job.deadline)) {
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

export const checkApplied = async (req, res) => {
  try {
    const existing = await Application.exists({
      job: req.params.jobId,
      applicant: req.user._id
    });
    res.json({ applied: Boolean(existing) });
  } catch (error) {
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

export const getReceivedApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).select("_id");

    const applications = await Application.find({ job: { $in: jobs.map((job) => job._id) } })
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
      .populate("job", "title company location salary deadline")
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

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (application.status === "accepted" || application.status === "rejected") {
      return res.status(400).json({ message: "This application has already been decided and cannot be withdrawn" });
    }

    await application.deleteOne();
    res.json({ message: "Application withdrawn" });
  } catch (error) {
    handleError(res, error);
  }
};