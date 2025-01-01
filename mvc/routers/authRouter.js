const authCtrl = require('../controllers/authController')
const express = require('express')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/signup', authCtrl.signUp)
router.post('/signin', authCtrl.signIn)
router.get('/logout', authMiddleware, (req, res) => {
	req.session.destroy(err => {
		if (err) {
			return res.status(500).json({ message: 'Failed to log out' })
		}
		res.redirect('/')
	})
})

module.exports = router
