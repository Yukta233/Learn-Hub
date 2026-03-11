const jwt = require("jsonwebtoken")

// Protect routes (verify token)

const protect = (req, res, next) => {

let token = req.headers.authorization

if(!token){
 return res.status(401).json({message:"No token provided"})
}

try{

// Format: Bearer TOKEN
token = token.split(" ")[1]

const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123")

req.user = decoded

next()

}catch(error){

return res.status(401).json({message:"Invalid token"})

}

}


// Role authorization middleware

const authorizeRoles = (...roles) => {

return (req,res,next)=>{

if(!roles.includes(req.user.role)){
 return res.status(403).json({message:"Access denied"})
}

next()

}

}

module.exports = {
protect,
authorizeRoles
}