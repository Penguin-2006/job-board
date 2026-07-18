import express from "express";
import {
  applyForJob,
  getApplicationsByJob,
  getMyApplications,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", protect, applyForJob);
router.get("/job/:jobId", protect, getApplicationsByJob);
router.get("/me", protect, getMyApplications);
router.put("/:id", protect, updateApplicationStatus);

export default router;