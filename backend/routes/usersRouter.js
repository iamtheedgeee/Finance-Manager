const express = require('express');
const router = express.Router();
const {getUser,getSummary}=require('../controllers/usersController')

router.get('/',getUser);

router.get('/summary',getSummary)
module.exports = router;
