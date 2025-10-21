const { PrismaClient } = require('../generated/prisma')
const {CustomError}=require('../middle_ware/errorHandler')
const {StatusCodes}=require('http-status-codes')
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')
const prisma=require('../prismaClient')

const saltRounds=10

const refreshCookieOptions={
    httpOnly:true,
    secure:false,
    sameSite:'lax',
    maxAge:7*24*60*60*1000
}
const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET
const accessTokenExpiry='15m'
const refreshTokenExpiry='30d'

//add default categories at signup
const DEFAULT_CATEGORIES=[
    {name:"Salary", type:"INCOME"},
    {name:"Side Hustles", type:"INCOME"},
    {name:"Business Income", type:"INCOME"},
    {name:"Investment Income", type:"INCOME"},
    {name:"Gifts", type:"INCOME"},
    {name:"Other Income", type:"INCOME"},
    {name:"Rent", type:"EXPENSE"},
    {name:"Utilities", type:"EXPENSE"},
    {name:"Transportation", type:"EXPENSE"},
    {name:"Taxes", type:"EXPENSE"},
    {name:"Groceries", type:"EXPENSE"},
]
const signupController= async(req,res)=>{
    const {username,email,password}=req.body
    const hashedPassword=await bcrypt.hash(password,saltRounds)
    const user= await prisma.user.create({
        data:{
        username,
        email,
        password:hashedPassword,
        }
    })  
    const categories=DEFAULT_CATEGORIES.map((category)=>{
        return {...category,userId:user.id}
    })
    const count= await prisma.category.createMany({
        data:categories
    })
    const account=await prisma.account.create({
        data:{
            name:"Main",
            balance:0,
            type:"BANK",
            userId:user.id
        }
    })
    const accessToken= await jwt.sign({user:user.id},ACCESS_TOKEN_SECRET,{expiresIn:accessTokenExpiry})
    const refreshToken=await jwt.sign({user:user.id},REFRESH_TOKEN_SECRET,{expiresIn:refreshTokenExpiry})
    res.cookie("refreshToken",refreshToken,refreshCookieOptions)
    .status(StatusCodes.CREATED).json({accessToken})
}

const loginController= async(req,res)=>{
    const {username,password}=req.body
    const user= await prisma.user.findUnique({where:{username}})
    if(!user){
        throw new CustomError('User not Found',StatusCodes.NOT_FOUND)
    }
    const passwordCorrect= await bcrypt.compare(password,user.password)
    if(!passwordCorrect){
        throw new CustomError('Incorrect Password',StatusCodes.UNAUTHORIZED)
    }
    const accessToken= await jwt.sign({user:user.id},ACCESS_TOKEN_SECRET,{expiresIn:accessTokenExpiry})
    const refreshToken=await jwt.sign({user:user.id},REFRESH_TOKEN_SECRET,{expiresIn:refreshTokenExpiry})
    res.cookie("refreshToken",refreshToken,refreshCookieOptions)
    .status(StatusCodes.ACCEPTED).json({accessToken})
}
const logoutController=async(req,res)=>{
    const {maxAge,...clearCookieOptions}=refreshCookieOptions
    res.clearCookie('refreshToken',clearCookieOptions)
    res.sendStatus(200)
}

const refreshController= async(req,res)=>{
    console.log("refreshing..")
    const refreshToken= req.cookies?.refreshToken
    if(!refreshToken){
        return res.status(StatusCodes.NO_CONTENT).json({msg:"No Token"})
    }
    const {user}=await jwt.verify(refreshToken,REFRESH_TOKEN_SECRET)
    const accessToken=await jwt.sign({user},ACCESS_TOKEN_SECRET,{expiresIn:accessTokenExpiry})
    res.status(StatusCodes.OK).json({accessToken})

}

module.exports={
    signupController,
    loginController,
    refreshController,
    logoutController
}