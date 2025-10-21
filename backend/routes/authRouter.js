const express=require('express')
const router = express.Router();
const {signupController,loginController,refreshController,logoutController}=require('../controllers/authController')

//base/auth
router.post('/signup',signupController)
router.post('/login',loginController)
router.post('/logout',logoutController)
router.post('/refresh',refreshController)


module.exports=router