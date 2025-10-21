const {fetchIncomeExpenseChartData, fetchExpenseByCategoryChartData, getDateRange, fetchExpensePieChartData}=require('../services/services')
const { StatusCodes } = require('http-status-codes')


const incomeExpenseData=async(req,res)=>{
    const userId=req.user
    const {date,interval}=req.query
    const {gte,lte}=await getDateRange(date,userId)
    const chartData=await fetchIncomeExpenseChartData(interval,gte,lte,userId)
    res.status(StatusCodes.OK).json({chartData,date:{gte,lte}})
}

const expenseByCatData=async(req,res)=>{
    const userId=req.user
    const {date,interval,categoryId}=req.query
    const {gte,lte}=await getDateRange(date,userId)
    const chartData= await fetchExpenseByCategoryChartData(interval,gte,lte,categoryId)
    res.status(StatusCodes.OK).json({chartData,date:{gte,lte}})
}

const expensePieChartData=async(req,res)=>{
    const userId=req.user
    const {date,type}=req.query
    const {gte,lte}=await getDateRange(date,userId)
    const chartData=await fetchExpensePieChartData(gte,lte,userId,type)
    res.status(StatusCodes.OK).json({chartData,date:{gte,lte}})
}
module.exports={incomeExpenseData,expenseByCatData,expensePieChartData}
