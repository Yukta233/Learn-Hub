const Course = require("../models/Course")

const getCourses = async (req,res)=>{

try{

const courses = await Course.find().populate("instructor","username")

res.json(courses)

}catch(err){

res.status(500).json({message:"Error fetching courses"})

}

}

const getCourseById = async (req,res)=>{

try{

const course = await Course.findById(req.params.id)
.populate("instructor","username")

res.json(course)

}catch(err){

res.status(500).json({message:"Course not found"})

}

}

const getMyCourses = async (req,res)=>{

try{

const courses = await Course.find({ instructor: req.user.id }).populate("instructor","username")

res.json(courses)

}catch(err){

res.status(500).json({message:"Error fetching your courses"})

}

}

const createCourse = async (req,res)=>{

try{

const {title,description,price, videos} = req.body

const course = new Course({
 title,
 description,
 price, // may be undefined; schema will default it
 instructor: req.user.id,
 videos: Array.isArray(videos) ? videos : []
})

await course.save()

res.json({
 message: "Course created successfully",
 course
})

}catch(err){

console.log(err)

res.status(500).json({message:"Course creation failed"})

}

}

const updateCourse = async (req,res)=>{

try{

const { title, description, price, videos } = req.body

const course = await Course.findById(req.params.id)

if(!course) return res.status(404).json({message:"Course not found"})

if(String(course.instructor) !== String(req.user.id) && req.user.role !== 'admin'){
 return res.status(403).json({message:"Access denied"})
}

if(title!==undefined) course.title = title
if(description!==undefined) course.description = description
if(price!==undefined) course.price = price
if(videos!==undefined && Array.isArray(videos)) course.videos = videos

await course.save()

res.json({message:"Course updated", course})

}catch(err){

res.status(500).json({message:"Course update failed"})

}

}

const deleteCourse = async (req,res)=>{

try{

const course = await Course.findById(req.params.id)

if(!course) return res.status(404).json({message:"Course not found"})

if(String(course.instructor) !== String(req.user.id) && req.user.role !== 'admin'){
 return res.status(403).json({message:"Access denied"})
}

await course.deleteOne()

res.json({message:"Course deleted"})

}catch(err){

res.status(500).json({message:"Course delete failed"})

}

}

module.exports = {
getCourses,
getCourseById,
getMyCourses,
createCourse,
updateCourse,
deleteCourse
}