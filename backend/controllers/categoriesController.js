const { PrismaClient } = require('../generated/prisma')
const {CustomError}=require('../middle_ware/errorHandler')
const {StatusCodes}=require('http-status-codes')
const {fetchCategory}=require('../services/services')
const prisma=require('../prismaClient')

const getCategories=async(req,res)=>{
    const userId=req.user
    const categories=await prisma.category.findMany({
        where:{userId,isActive:true},
        include:{
            transactions:true,
            budget:true
        }

    })
    res.status(StatusCodes.OK).json({categories})

}


const getCategory=async(req,res)=>{
    const userId=req.user
    const id=req.params
    const category=await fetchCategory(id,userId)
    res.status(StatusCodes.OK).json({category})
}

const createCategory=async(req,res)=>{
    const userId=req.user
    const{name,type}=req.body
    const category=await prisma.category.create({
        data:{
            userId,name,type
        }
    })

    res.status(StatusCodes.CREATED).json({category})
}

const editCategory=async(req,res)=>{
    const {id}=req.params
    const {name,type}=req.body
    const category=await prisma.category.update({
        where:{id},
        data:{
            name,type
        }
    })
    res.status(StatusCodes.CREATED).json({category})
}

const deleteCategory=async(req,res)=>{
    const {id}=req.params
    await prisma.category.update({
        where:{id},
        data:{ 
            isActive:false,
            deletedAt: new Date()
        }
    })
    res.status(StatusCodes.ACCEPTED).json({msg:"Deleted"})
    
}

module.exports={getCategories,getCategory,createCategory,editCategory,deleteCategory}