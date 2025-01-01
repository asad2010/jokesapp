const JWT = require('jsonwebtoken')
require('dotenv').config()

const authMiddleware = (req, res, next) => {
	if (req.session && req.session.user) {
		req.user = req.session.user
		return next()
	}

	let token = req.header('Authorization')

	if (token && token.startsWith('Bearer ')) {
		token = token.split(' ')[1]
	}

	if (!token) {
		req.user = null
		return res.redirect('/')
	}

	try {
		const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)
		req.user = decoded
		if (decoded.role === 101) {
			req.currentUserAdmin = true
		}

		req.session.user = decoded
		next()
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

module.exports = { authMiddleware }
