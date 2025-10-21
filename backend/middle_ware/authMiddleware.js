const jwt=require('jsonwebtoken')
const {StatusCodes}=require('http-status-codes')
const {CustomError}=require('./errorHandler')

const authMiddleware=async(req,res,next)=>{
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    if(!token){
        throw new CustomError("No Token",StatusCodes.UNAUTHORIZED)
    }
    const {user}= await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    req.user=user
    next()
}

module.exports=authMiddleware