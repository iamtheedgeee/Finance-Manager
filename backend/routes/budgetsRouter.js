const express=require('express')
const router=express.Router()
const {getBudget,getBudgets,createBudget,editBudget,deleteBudget}=require('../controllers/budgetsController')
//base/api/Budget

router.get('/',getBudgets)
router.post('/',createBudget)
router.get('/:id',getBudget)
router.put('/:id',editBudget)
router.delete('/:id',deleteBudget)

module.exports=router