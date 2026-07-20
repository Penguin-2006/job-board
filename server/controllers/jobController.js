import Job from "../models/Job.js";


export const createJob = async (req, res) => {
  const { title, description, location, salary, skills, jobType, deadline } = req.body;

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
    res.status(500).json({ message: error.message });
  }
};


export const getJobs = async (req, res) => {
  try {
    const { skills, location, jobType } = req.query;
    let filter = {};

    if (skills) filter.skills = { $in: skills.split(",") };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;

    const jobs = await Job.find(filter).populate("postedBy", "name email").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};


export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};