const Quiz = require("../models/Quiz")
const Course = require("../models/Course")

// Create quiz
exports.createQuiz = async (req, res) => {
 try{
  const { courseId, questions } = req.body

  // Ensure only owner/admin creates/overwrites quiz
  const course = await Course.findById(courseId)
  if(!course) return res.status(404).json({message:"Course not found"})
  if(String(course.instructor) !== String(req.user.id) && req.user.role !== 'admin'){
   return res.status(403).json({message:"Access denied"})
  }

  let quiz = await Quiz.findOne({ courseId })
  if(quiz){
   quiz.questions = Array.isArray(questions) ? questions : []
   await quiz.save()
  }else{
   quiz = new Quiz({ courseId, questions })
   await quiz.save()
  }

  res.json({ message:"Quiz saved successfully", quiz })
 }catch(error){
  res.status(500).json({message:error.message})
 }
}

// Get quiz by course
exports.getQuizByCourse = async (req,res)=>{
 try{
  const quiz = await Quiz.findOne({ courseId:req.params.courseId })
  res.json(quiz)
 }catch(error){
  res.status(500).json({message:error.message})
 }
}

// Get quizzes for instructor's courses
exports.getMyQuizzes = async (req,res)=>{
 try{
  // find courses owned by instructor
  const myCourses = await Course.find({ instructor: req.user.id }).select('_id')
  const ids = myCourses.map(c=>c._id)
  const quizzes = await Quiz.find({ courseId: { $in: ids } })
  res.json(quizzes)
 }catch(error){
  res.status(500).json({message:error.message})
 }
}

// Update quiz
exports.updateQuiz = async (req,res)=>{
 try{
  const { questions } = req.body
  const quiz = await Quiz.findById(req.params.id)
  if(!quiz) return res.status(404).json({message:"Quiz not found"})

  const course = await Course.findById(quiz.courseId)
  if(!course) return res.status(404).json({message:"Course not found"})
  if(String(course.instructor) !== String(req.user.id) && req.user.role !== 'admin'){
   return res.status(403).json({message:"Access denied"})
  }

  if(Array.isArray(questions)) quiz.questions = questions
  await quiz.save()
  res.json({message:"Quiz updated", quiz})
 }catch(error){
  res.status(500).json({message:error.message})
 }
}

// Delete quiz
exports.deleteQuiz = async (req,res)=>{
 try{
  const quiz = await Quiz.findById(req.params.id)
  if(!quiz) return res.status(404).json({message:"Quiz not found"})
  const course = await Course.findById(quiz.courseId)
  if(!course) return res.status(404).json({message:"Course not found"})
  if(String(course.instructor) !== String(req.user.id) && req.user.role !== 'admin'){
   return res.status(403).json({message:"Access denied"})
  }
  await quiz.deleteOne()
  res.json({message:"Quiz deleted"})
 }catch(error){
  res.status(500).json({message:error.message})
 }
}