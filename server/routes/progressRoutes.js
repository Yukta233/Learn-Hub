const express = require("express")
const router = express.Router()

const { getMyProgress, markVideoComplete, recordQuizAttempt } = require("../controllers/progressController")
const { protect, authorizeRoles } = require("../middleware/authMiddleware")

// Get my progress (student or admin viewing self)
router.get("/me", protect, authorizeRoles("student","admin","instructor"), getMyProgress)

// Mark a video as completed for this student
router.put("/course/:courseId/video", protect, authorizeRoles("student","admin"), markVideoComplete)

// Record a quiz attempt for this student
router.post("/course/:courseId/quiz", protect, authorizeRoles("student","admin"), recordQuizAttempt)

module.exports = router