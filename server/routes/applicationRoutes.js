import express from "express";
import {
  applyForJob,
  checkApplied,
  getApplicationsByJob,
  getReceivedApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/me", protect, restrictTo("applicant"), getMyApplications);
router.get("/received", protect, restrictTo("company"), getReceivedApplications);
router.get("/check/:jobId", protect, restrictTo("applicant"), checkApplied);
router.get("/job/:jobId", protect, restrictTo("company"), getApplicationsByJob);
router.post("/:jobId", protect, restrictTo("applicant"), applyForJob);
router.put("/:id", protect, restrictTo("company"), updateApplicationStatus);
router.delete("/:id", protect, restrictTo("applicant"), withdrawApplication);

export default router;