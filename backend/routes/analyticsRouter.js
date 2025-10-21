const express=require('express')
const router=express.Router()
const {incomeExpenseData, expenseByCatData, expensePieChartData}= require('../controllers/analyticsController')


router.get('/income-expense-data',incomeExpenseData)
router.get('/expense-by-category-data',expenseByCatData)
router.get('/expense-pie-chart-data',expensePieChartData)
module.exports=router