const { PrismaClient } = require('../generated/prisma')
const {CustomError}=require('../middle_ware/errorHandler')
const {StatusCodes}=require('http-status-codes')
const {getMonthRange, getBudgetWithSpent}=require('../services/services')
const prisma=require('../prismaClient')


const getBudgets=async(req,res)=>{
    const userId=req.user
    const budgets=await getBudgetWithSpent(userId)
    res.status(StatusCodes.OK).json({budgets})
}

const getBudget=async(req,res)=>{
    const userId=req.user
    const id=req.params
    const budget=await prisma.budget.findUniqueOrThrow({
        where:{
            id,userId
        },
        include:{
            category:true
        }
    })
    res.status(StatusCodes.OK).json({budget})
}   

const createBudget=async(req,res)=>{
    const userId=req.user
    const{categoryId,limit}=req.body
    const{startDate,endDate}=getMonthRange()
    const budget=await prisma.budget.create({
        data:{
            userId,categoryId,limit,startDate,endDate
        }
    })
    res.status(StatusCodes.CREATED).json({budget})
}

const editBudget=async(req,res)=>{
    const {id}=req.params
    const {categoryId,limit}=req.body
    const budget=await prisma.budget.update({
        where:{id},
        data:{
            categoryId,limit
        }
    })
    res.status(StatusCodes.CREATED).json({budget})
}

const deleteBudget=async(req,res)=>{
    const {id}=req.params
    await prisma.budget.delete({
        where:{id}
    })
    res.status(StatusCodes.ACCEPTED).json({msg:"deleted"})
}

module.exports={getBudgets,getBudget,createBudget,editBudget,deleteBudget}