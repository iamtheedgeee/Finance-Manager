const express=require('express')
const { getDateRange, importTransactions } = require('../services/services')
const router=express.Router()
const multer=require('multer')
const xlsx=require('xlsx')
const { CustomError } = require('../middle_ware/errorHandler')
const { StatusCodes } = require('http-status-codes')

const storage=multer.memoryStorage()
const filter=(req,file,cb)=>{
    const allowed=[
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv"
    ]

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only XLS, XLSX, and CSV files are allowed"), false)
    }
}

const upload=multer({storage,filter})


//base/api/functions
router.get('/get-date-from-preset',async(req,res)=>{
    const userId=req.user
    const{preset}=req.query
    const date=await getDateRange({preset},userId)
    res.status(200).json({date})
})

router.post('/import',upload.single('spreadSheetFile'),async(req,res)=>{
    const userId=req.user
    const file=req.file
    console.log(file)
    if(!file){
        throw new CustomError('Error',StatusCodes.BAD_REQUEST)
    }
    const workbook= xlsx.read(file.buffer,{type:'buffer'})
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data=xlsx.utils.sheet_to_json(sheet)
    const count=await importTransactions(data,userId)
    res.status(201).json({count})
   
})

module.exports=router