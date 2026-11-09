import mongoose from "mongoose";
import { isHttpUrl, MAX_URL_LENGTH } from "../utils/url.js";

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  resumeUrl: {
    type: String,
    required: true,
    trim: true,
    maxlength: MAX_URL_LENGTH,
    validate: {
      validator: isHttpUrl,
      message: "A valid resume link is required"
    }
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);