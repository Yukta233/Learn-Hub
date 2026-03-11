const express = require("express")
const router = express.Router()

const { createQuiz, getQuizByCourse, getMyQuizzes, updateQuiz, deleteQuiz } = require("../controllers/quizController")
const { protect, authorizeRoles } = require("../middleware/authMiddleware")

router.get("/mine", protect, authorizeRoles("instructor","admin"), getMyQuizzes)

router.get("/:courseId", getQuizByCourse)

router.post(
 "/create",
 protect,
 authorizeRoles("instructor","admin"),
 createQuiz
)

router.put(
 "/:id",
 protect,
 authorizeRoles("instructor","admin"),
 updateQuiz
)

router.delete(
 "/:id",
 protect,
 authorizeRoles("instructor","admin"),
 deleteQuiz
)

module.exports = router