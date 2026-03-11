const express = require("express")
const router = express.Router()

const { createCourse, getCourses, getCourseById, getMyCourses, updateCourse, deleteCourse } = require("../controllers/courseController")
const { protect, authorizeRoles } = require("../middleware/authMiddleware")

router.get("/", getCourses)

router.get("/mine", protect, getMyCourses)

router.get("/:id", getCourseById)

router.post(
 "/create",
 protect,
 authorizeRoles("instructor","admin"),
 createCourse
)

router.put(
 "/:id",
 protect,
 authorizeRoles("instructor","admin"),
 updateCourse
)

router.delete(
 "/:id",
 protect,
 authorizeRoles("instructor","admin"),
 deleteCourse
)

module.exports = router