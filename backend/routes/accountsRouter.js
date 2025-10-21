const express=require('express')
const router=express.Router()
const {getAccount,getAccounts,createAccount,editAccount,deleteAccount}=require('../controllers/accountsController')
//base/api/accounts

router.get('/',getAccounts)
router.post('/',createAccount)
router.get('/:id',getAccount)
router.put('/:id',editAccount)
router.delete('/:id',deleteAccount)

module.exports=router