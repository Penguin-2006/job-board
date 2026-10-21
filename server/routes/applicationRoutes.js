import express from "express";
import {
  applyForJob,
  getApplicationsByJob,
  getMyApplications,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:jobId", protect, restrictTo("applicant"), applyForJob);
router.get("/job/:jobId", protect, restrictTo("company"), getApplicationsByJob);
router.get("/me", protect, restrictTo("applicant"), getMyApplications);
router.put("/:id", protect, restrictTo("company"), updateApplicationStatus);

export default router;