const express=require('express')
const router=express.Router()
const {getTransaction,getTransactions,createTransaction,editTransaction, archiveTransaction}=require('../controllers/transactionsController')
//base/api/Transactions

router.get('/',getTransactions)
router.post('/',createTransaction)
router.get('/:id',getTransaction)
router.put('/:id',editTransaction)
router.delete('/:id',archiveTransaction)


module.exports=router