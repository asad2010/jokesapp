const authCtrl = require('../controllers/authController')
const express = require('express')
const router = express.Router()

router.post('/signup', authCtrl.signUp)
router.post('/signin', authCtrl.signIn)

module.exports = router
