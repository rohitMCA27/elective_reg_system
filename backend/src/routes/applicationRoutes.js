import express from "express";
import {
    applyToCourse,
    getMyApplications,
    getApplications,
    updateApplicationStatus
} from "../controllers/applicationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// APPLY
router.post("/", protect, authorize("student"), applyToCourse);

// STUDENT
router.get("/my", protect, authorize("student"), getMyApplications);

// FACULTY
router.get("/:courseId", protect, authorize("faculty"), getApplications);

// APPROVE / REJECT
router.put("/:id", protect, authorize("faculty"), updateApplicationStatus);

export default router;