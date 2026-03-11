const mongoose = require("mongoose")

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  ts: { type: Date, default: Date.now }
}, { _id: false })

const courseProgressSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  videosCompleted: { type: [String], default: [] },
  quizAttempts: { type: [quizAttemptSchema], default: [] },
  latestScore: { type: Number, default: 0 },
  latestTotal: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false })

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  courses: { type: [courseProgressSchema], default: [] }
}, { timestamps: true })

module.exports = mongoose.model("Progress", progressSchema)