const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

 username:{
  type:String,
  required:true
 },

 email:{
  type:String,
  required:true,
  unique:true
 },

 password:{
  type:String,
  required:true
 },

 role:{
  type:String,
  enum:["student","instructor","admin"],
  default:"student"
 },

 phone:{
  type:String,
  default:""
 },

 avatarUrl:{
  type:String,
  default:""
 }

},{timestamps:true})

module.exports = mongoose.model("User",userSchema)