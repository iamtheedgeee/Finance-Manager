const express=require('express')
const router=express.Router()
const {getCategory,getCategories,createCategory,editCategory,deleteCategory}=require('../controllers/categoriesController')
//base/api/categories

router.get('/',getCategories)
router.post('/',createCategory)
router.get('/:id',getCategory)
router.put('/:id',editCategory)
router.delete('/:id',deleteCategory)

module.exports=router