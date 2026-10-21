import Job from "../models/Job.js";
import Application from "../models/Application.js";
import handleError from "../utils/handleError.js";

const JOB_TYPES = ["full-time", "part-time", "internship", "remote"];
const asString = (value) => (typeof value === "string" ? value : "");
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createJob = async (req, res) => {
  const { title, description, location, salary, skills, jobType, deadline } = req.body || {};

  try {
    const job = await Job.create({
      title,
      description,
      company: req.user.company,
      location,
      salary,
      skills,
      jobType,
      deadline,
      postedBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    handleError(res, error);
  }
};

export const getJobs = async (req, res) => {
  try {
    const search = asString(req.query.search).trim();
    const skills = asString(req.query.skills);
    const location = asString(req.query.location).trim();
    const jobType = asString(req.query.jobType);
    const filter = {};

    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { title: pattern },
        { company: pattern },
        { description: pattern },
        { skills: pattern }
      ];
    }

    const skillPatterns = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .map((skill) => new RegExp(escapeRegex(skill), "i"));
    if (skillPatterns.length) filter.skills = { $in: skillPatterns };

    if (location) {
      filter.location = { $regex: escapeRegex(location), $options: "i" };
    }

    if (JOB_TYPES.includes(jobType)) filter.jobType = jobType;

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    handleError(res, error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const allowed = ["title", "description", "location", "salary", "skills", "jobType", "deadline"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body && req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    res.json(updatedJob);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: "Job removed" });
  } catch (error) {
    handleError(res, error);
  }
};