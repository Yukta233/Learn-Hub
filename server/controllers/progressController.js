const Progress = require("../models/Progress")

// Helpers
const findOrCreateProgress = async (userId) => {
  let p = await Progress.findOne({ user: userId })
  if(!p){
    p = new Progress({ user: userId, courses: [] })
    await p.save()
  }
  return p
}

// GET /api/progress/me
exports.getMyProgress = async (req, res) => {
  try {
    const p = await findOrCreateProgress(req.user.id)
    res.json(p)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/progress/course/:courseId/video { videoId }
exports.markVideoComplete = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.params
    const { videoId } = req.body

    const p = await findOrCreateProgress(userId)
    let course = p.courses.find(c => String(c.courseId) === String(courseId))
    if(!course){
      course = { courseId, videosCompleted: [], quizAttempts: [], latestScore: 0, latestTotal: 0, updatedAt: new Date() }
      p.courses.push(course)
    }
    if(videoId && !course.videosCompleted.includes(videoId)){
      course.videosCompleted.push(videoId)
    }
    course.updatedAt = new Date()
    await p.save()
    res.json({ message: 'Video marked complete', progress: p })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/progress/course/:courseId/quiz { quizId, score, total }
exports.recordQuizAttempt = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.params
    const { quizId, score, total } = req.body

    const p = await findOrCreateProgress(userId)
    let course = p.courses.find(c => String(c.courseId) === String(courseId))
    if(!course){
      course = { courseId, videosCompleted: [], quizAttempts: [], latestScore: 0, latestTotal: 0, updatedAt: new Date() }
      p.courses.push(course)
    }
    course.quizAttempts.push({ quizId, score: Number(score)||0, total: Number(total)||0, ts: new Date() })
    course.latestScore = Number(score)||0
    course.latestTotal = Number(total)||0
    course.updatedAt = new Date()

    await p.save()
    res.json({ message: 'Quiz recorded', progress: p })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}