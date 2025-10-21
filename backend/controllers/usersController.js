const { PrismaClient } = require('../generated/prisma')
const {CustomError}=require('../middle_ware/errorHandler')
const {StatusCodes}=require('http-status-codes')
const {getDateRange}=require('../services/services')
const prisma=require('../prismaClient')

const getUser= async (req, res)=> {
    const userId=req.user
    const user= await prisma.user.findUniqueOrThrow({where:{id:userId}})
    res.status(200).json({user})
}

const getSummary=async(req,res)=>{
    const userId=req.user
    const {date}=req.query
    range=await getDateRange(date,userId)
    const {_sum:{balance}}=await prisma.account.aggregate({
        _sum:{balance:true},
        where:{
            userId,
            isActive:true
        }
    })

    const {_sum:{amount:expense}}=await prisma.transaction.aggregate({
        _sum:{amount:true},
        where:{
            userId,
            isActive:true,
            category:{
                type:"EXPENSE"
            },
            date:{
                gte:range.gte,
                lte:range.lte
            }
        }
    })

    const {_sum:{amount:income}}= await prisma.transaction.aggregate({
        _sum:{amount:true},
        where:{
            userId,
            isActive:true,
            category:{
                type:"INCOME"
            },
            date:{
                gte:range.gte,
                lte:range.lte
            }
        }
    })
    res.status(StatusCodes.OK).json({balance:balance||0,expense:expense||0,income:income||0})
}

module.exports={getUser,getSummary}