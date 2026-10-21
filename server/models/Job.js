import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  jobType: {
    type: String,
    enum: ["full-time", "part-time", "internship", "remote"],
    default: "full-time"
  },
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value >= new Date(new Date().setUTCHours(0, 0, 0, 0)),
      message: "Deadline cannot be in the past"
    }
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);