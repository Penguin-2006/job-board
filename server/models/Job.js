import mongoose from "mongoose";
import { isClosed, startOfTodayInZone } from "../utils/deadline.js";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  skills: {
    type: [{
      type: String,
      trim: true,
      maxlength: 40
    }],
    validate: {
      validator: (value) => value.length <= 20,
      message: "A job can list at most 20 skills"
    }
  },
  jobType: {
    type: String,
    enum: ["full-time", "part-time", "internship", "remote"],
    default: "full-time"
  },
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value >= startOfTodayInZone(),
      message: "Deadline cannot be in the past"
    }
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true,
  id: false,
  toJSON: { virtuals: true }
});

jobSchema.virtual("isClosed").get(function () {
  return isClosed(this.deadline);
});

export default mongoose.model("Job", jobSchema);