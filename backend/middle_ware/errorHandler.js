const {StatusCodes}=require('http-status-codes')
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/library");

class CustomError extends Error {
    constructor(message,status_code) {
      super(message)
      this.status_code=status_code
    }
}

const errorHandlerMiddleware=(err,req,res,next)=>{
    console.log(err)
    if (err instanceof CustomError){
        return res.status(err.status_code).json({msg:err.message})
    }
    
    if(err.code==="P2002"){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({msg:err.meta.target})
    }

    if(err.code==="P2025"){
        return res.status(StatusCodes.NOT_FOUND).json({msg:"User Not Found"})
    }

    if(err.name==="TokenExpiredError"){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:"TokenExpired"})
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg:"Something went wrong" })
}

module.exports={CustomError,errorHandlerMiddleware}