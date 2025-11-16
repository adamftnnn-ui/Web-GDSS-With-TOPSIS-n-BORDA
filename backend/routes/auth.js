const express=require('express')
const { login, register, refreshAccessToken, logout } = require('../controllers/authController')
const router=express.Router()

router.post('/login',login)
router.post('/logout',logout)
router.post('/refresh',refreshAccessToken)
router.post('/register',register)

module.exports=router