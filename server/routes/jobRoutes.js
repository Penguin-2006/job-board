import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";
import protect from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, restrictTo("company"), createJob);
router.put("/:id", protect, restrictTo("company"), updateJob);
router.delete("/:id", protect, restrictTo("company"), deleteJob);

export default router;