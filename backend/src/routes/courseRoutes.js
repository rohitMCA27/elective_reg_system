import express from "express";
import { createCourse, getCourses, finalizeCourse } from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { updateCourse, deleteCourse } from "../controllers/courseController.js";


const router = express.Router();


router.post("/", protect, authorize("faculty"), createCourse);
router.get("/", protect, getCourses);
router.put("/finalize/:courseId", protect, authorize("faculty"), finalizeCourse);
router.put("/:id", protect, authorize("faculty"), updateCourse);
router.delete("/:id", protect, authorize("faculty"), deleteCourse);


export default router;