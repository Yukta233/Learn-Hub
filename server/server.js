const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const connectDB = require("./config/db")

// ROUTES
const authRoutes = require("./routes/authRoutes")
const courseRoutes = require("./routes/courseRoutes")
const quizRoutes = require("./routes/quizRoutes")
const progressRoutes = require("./routes/progressRoutes")

dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')))

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/quizzes", quizRoutes)
app.use("/api/progress", progressRoutes)

app.get("/", (req, res) => {
  res.send("API Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})