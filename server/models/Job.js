import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  skills: [{
    type: String
  }],
  jobType: {
    type: String,
    enum: ["full-time", "part-time", "internship", "remote"],
    default: "full-time"
  },
  deadline: {
    type: Date,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);