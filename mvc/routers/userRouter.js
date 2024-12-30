const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController')

router.get('/getUsers', userCtrl.getAllUsers);
router.get('/getUser/:id', userCtrl.getUser);

module.exports = router;