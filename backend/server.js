//Importing Packages
require('dotenv').config()
require("express-async-errors");
const express = require('express');
const cors= require("cors")
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const prisma=require('./prismaClient')


//Importing Routers And MiddleWare
const authRouter = require('./routes/authRouter');
const accountsRouter=require('./routes/accountsRouter')
const budgetsRouter=require('./routes/budgetsRouter')
const categoriesRouter=require('./routes/categoriesRouter')
const transactionsRouter=require('./routes/transactionsRouter')
const usersRouter = require('./routes/usersRouter');
const analyticsRouter=require('./routes/analyticsRouter')
const functionsRouter=require('./routes/functionsRouter')

const notFound=require('./middle_ware/notFound')
const {errorHandlerMiddleware}=require('./middle_ware/errorHandler')
const authMiddleware=require('./middle_ware/authMiddleware')

//Initialising Server and Port
const app = express();
const PORT = process.env.PORT || 3000;


//Using Global Middleware
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//Mapping Routers
app.use('/auth',authRouter);
app.use('/api/users',authMiddleware,usersRouter)
app.use('/api/accounts',authMiddleware,accountsRouter)
app.use('/api/budgets',authMiddleware,budgetsRouter)
app.use('/api/categories',authMiddleware,categoriesRouter)
app.use('/api/transactions',authMiddleware,transactionsRouter)
app.use('/api/analytics',authMiddleware,analyticsRouter)
app.use('/api/functions',authMiddleware,functionsRouter)

//Using Error Handling Middleware
app.use(errorHandlerMiddleware)

//Using React frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
})




//Starting Server
async function startServer(){
  try{
    await prisma.$connect()
    console.log("Database Connected Successfully")

    app.listen(PORT,()=>{
      console.log(`Server is running at port: ${PORT}`)
    })
  }catch(error){
    console.error("Failed to connect to database",error)
    process.exit(1)
  }
}
startServer()
