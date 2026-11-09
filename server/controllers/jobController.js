import Job from "../models/Job.js";
import Application from "../models/Application.js";
import handleError from "../utils/handleError.js";
import { escapeRegex, skillPattern } from "../utils/search.js";
import { openDeadlineCutoff } from "../utils/deadline.js";

const JOB_TYPES = ["full-time", "part-time", "internship", "remote"];
const asString = (value) => (typeof value === "string" ? value : "");

const parsePositiveInt = (value, fallback, max) => {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number) || number < 1) return fallback;
  return Math.min(number, max);
};

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
    const filter = { deadline: { $gte: openDeadlineCutoff() } };

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
      .map(skillPattern);
    if (skillPatterns.length) filter.skills = { $in: skillPatterns };

    if (location) {
      filter.location = { $regex: escapeRegex(location), $options: "i" };
    }

    if (JOB_TYPES.includes(jobType)) filter.jobType = jobType;

    const query = Job.find(filter)
      .populate("postedBy", "name")
      .sort({ createdAt: -1, _id: -1 });

    if (req.query.page === undefined) {
      return res.json(await query.limit(200));
    }

    const page = parsePositiveInt(req.query.page, 1, 100000);
    const limit = parsePositiveInt(req.query.limit, 12, 50);

    const [jobs, total] = await Promise.all([
      query.skip((page - 1) * limit).limit(limit),
      Job.countDocuments(filter)
    ]);

    res.json({ jobs, page, pages: Math.max(1, Math.ceil(total / limit)), total });
  } catch (error) {
    handleError(res, error);
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1, _id: -1 });
    res.json(jobs);
  } catch (error) {
    handleError(res, error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name");

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
      returnDocument: "after",
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

    await job.deleteOne();
    await Application.deleteMany({ job: job._id });
    res.json({ message: "Job removed" });
  } catch (error) {
    handleError(res, error);
  }
};