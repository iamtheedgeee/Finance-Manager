const {CustomError}=require('../middle_ware/errorHandler')
const {StatusCodes}=require('http-status-codes')
const prisma=require('../prismaClient')

const createAccount=async(req,res)=>{
    const userId=req.user
    const{name,type,balance}=req.body
    const account=await prisma.account.create({
        data:{
            userId,name,type,balance
        }
    })
    res.status(StatusCodes.CREATED).json({account})
}

const getAccounts=async(req,res)=>{
    const userId=req.user
    const accounts=await prisma.account.findMany({
        where:{userId,isActive:true}
    })
    res.status(StatusCodes.OK).json({accounts})
}

const getAccount=async(req,res)=>{
    const userId=req.user
    const id=req.params
    const account=await prisma.account.findUniqueOrThrow({
        where:{
            id,
            userId
        },
        include:{transactions:true}
    })
    res.status(StatusCodes.OK).json({account})
}

const editAccount=async(req,res)=>{
    const {id}=req.params
    const {name,type}=req.body
    const account=await prisma.account.update({
        where:{id},
        data:{
            name,type
        }
    })
    res.status(StatusCodes.CREATED).json({account})
}

const deleteAccount=async(req,res)=>{
    const {id}=req.params
    await prisma.account.update({
        where:{id},
        data:{ 
            isActive:false,
            deletedAt: new Date()
        }
    })
    res.status(StatusCodes.ACCEPTED).json({msg:"Deleted"})
}

module.exports={getAccounts,getAccount,createAccount,editAccount,deleteAccount}