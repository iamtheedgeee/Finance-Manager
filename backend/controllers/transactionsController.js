const { PrismaClient } = require('../generated/prisma')
const {CustomError}=require('../middle_ware/errorHandler')
const {StatusCodes}=require('http-status-codes')
const { getDateRange } = require('../services/services')
const prisma=require('../prismaClient')

const getTransactions=async(req,res)=>{
    const userId=req.user
    let {page,category:catList,date:dateObj,account:accountList}=req.query
    const pageSize=10
    range=await getDateRange(dateObj,userId)
    const where={
        userId,
        isActive:true,
        ...(catList && {category:{
            name:{in:catList},
        }}),
        ...(accountList && {account:{
            name:{in:accountList}
        }}),
        date:{
            gte:range.gte,
            lte:range.lte
        }
    }
    const totalTransactions=await prisma.transaction.count({where})
    const maxPage=Math.ceil(totalTransactions/pageSize)
    page=Math.max(Math.min(page,maxPage),1)
    const skip=(page-1)*pageSize
    
    const transactions=await prisma.transaction.findMany({
        where,
        orderBy:{
            date:"desc"
        },
        include:{
            account:true,
            category:true
        }
        
    })
    const meta={
        maxPage,
        pagesLeft:maxPage-page
    }
    res.status(StatusCodes.OK).json({transactions,meta})
    
}

const getTransaction=async(req,res)=>{
    const userId=req.user
    const id=req.params
    const transaction=await prisma.transaction.findUniqueOrThrow({
        where:{
            id,userId
        },
        include:{
            account:true,
            category:true
        }
    })
    res.status(StatusCodes.OK).json({transaction})
    
}

const createTransaction=async(req,res)=>{
    const userId=req.user
    const{accountId,categoryId,amount,date,notes,type}=req.body
    const netEffect=type==="E"?-amount:amount
    const [transaction]=await prisma.$transaction([
        prisma.transaction.create({
            data:{
                userId,
                accountId,
                categoryId,
                amount,
                date:new Date(date),
                notes
            }
        }),
        prisma.account.update({
            where:{id:accountId},
            data:{balance:{increment:netEffect}}
        })
    ])
    res.status(StatusCodes.CREATED).json({transaction})
    
}

const editTransaction=async(req,res)=>{
    const {id}=req.params
    const{accountId,categoryId,amount,date,notes,type,oldAmount,oldType}=req.body
    
    const key=`${oldType}-${type}`
    let netEffect;
    switch(key){
        case "E-E":
            netEffect=(oldAmount-amount)
            break
        case "I-I":
            netEffect=(-oldAmount+amount)
            break
        case "I-E":
            netEffect=(-oldAmount-amount)
            break
        case "E-I":
            netEffect=(oldAmount+amount)
            break
       
    }
    
    const [transaction]=await prisma.$transaction([
        prisma.transaction.update({
            where:{id},
            data:{
                accountId,
                categoryId,
                amount,
                date:new Date(date),
                notes
            }
        }),
            
        prisma.account.update({
            where:{id:accountId},
            data:{balance:{increment:netEffect}}
        }),
           
    
    ])
    res.status(StatusCodes.CREATED).json({transaction})
}

const archiveTransaction=async(req,res)=>{
    const {id}=req.params
    const {amount,type,accountId}=req.body
    const netEffect=type==="E"?amount:-amount
    const [transaction]= await prisma.$transaction([
        prisma.transaction.update({
            where:{id},
            data:{ 
                isActive:false,
                deletedAt: new Date(),
            }
        }),

        prisma.account.update({
            where:{id:accountId},
            data:{
                balance:{increment:netEffect}
            }
        })

    ])
    res.status(StatusCodes.ACCEPTED).json({msg:"Deleted"})
}


module.exports={getTransactions,getTransaction,createTransaction,editTransaction,archiveTransaction}