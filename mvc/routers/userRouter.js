const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/userController')
const { authMiddleware } = require('../middlewares/authMiddleware')
router.get('/getUsers', authMiddleware, userCtrl.getAllUsers)
router.get('/getUser/:id', authMiddleware, userCtrl.getUser)
router.post('/updateUser/:id', authMiddleware, userCtrl.updUser)
router.post('/deleteUser/:id', authMiddleware, userCtrl.delUser)

module.exports = router
