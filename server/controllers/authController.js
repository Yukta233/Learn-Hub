const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")

// REGISTER
exports.register = async(req,res)=>{
 try{
  const {username,email,password,role} = req.body
  const existingUser = await User.findOne({email})
  if(existingUser){
    return res.status(400).json({message:"User already exists"})
  }
  const hashedPassword = await bcrypt.hash(password,10)
  const user = new User({ username, email, password:hashedPassword, role })
  await user.save()
  res.json({message:"User registered successfully"})
 }catch(error){
  res.status(500).json(error.message)
 }
}

// LOGIN
exports.login = async(req,res)=>{
 try{
  const {email,password} = req.body
  const user = await User.findOne({email})
  if(!user){
    return res.status(400).json({message:"Invalid email"})
  }
  const isMatch = await bcrypt.compare(password,user.password)
  if(!isMatch){
    return res.status(400).json({message:"Invalid password"})
  }
  const token = jwt.sign(
    {id:user._id,role:user.role},
    process.env.JWT_SECRET,
    {expiresIn:"7d"}
  )
  res.json({
    token,
    user:{
      id:user._id,
      username:user.username,
      email:user.email,
      role:user.role,
      phone:user.phone,
      avatarUrl:user.avatarUrl
    }
  })
 }catch(error){
  res.status(500).json(error.message)
 }
}

// Get my profile
exports.getMe = async (req,res)=>{
 try{
  const user = await User.findById(req.user.id).select("-password")
  if(!user) return res.status(404).json({message:"User not found"})
  res.json(user)
 }catch(error){
  res.status(500).json({message:"Failed to load profile"})
 }
}

// Update my profile (username, phone, avatarFile as base64 data URL)
exports.updateMe = async (req,res)=>{
 try{
  const { username, phone, avatarFile } = req.body
  const user = await User.findById(req.user.id)
  if(!user) return res.status(404).json({message:"User not found"})

  if(username!==undefined) user.username = username
  if(phone!==undefined) user.phone = phone

  if(avatarFile){
   const match = avatarFile.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
   if(match){
    const mime = match[1]
    const data = match[2]
    const ext = (mime.split('/')[1] || 'png').replace(/[^a-zA-Z0-9]/g,'')
    const uploadsDir = path.join(__dirname, "..", "uploads")
    if(!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
    const filename = `${user._id}_${Date.now()}.${ext}`
    const filePath = path.join(uploadsDir, filename)
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'))
    user.avatarUrl = `/uploads/${filename}`
   }
  }

  await user.save()
  res.json({
   message:"Profile updated",
   user: { id:user._id, username:user.username, email:user.email, role:user.role, phone:user.phone, avatarUrl:user.avatarUrl }
  })
 }catch(error){
  res.status(500).json({message:"Failed to update profile"})
 }
}
