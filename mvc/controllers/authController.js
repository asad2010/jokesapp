const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const Users = require('../models/userModel')

require('dotenv').config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authCtrl = {
	signUp: async (req, res) => {
		const { email, login } = req.body
		try {
			const existingUser = await Users.findOne({ $or: [{ email }, { login }] })
			if (existingUser) {
				return res.status(400).json({ message: 'User already exists!' })
			}

			const hashedPassword = await bcrypt.hash(req.body.password, 12)
			req.body.password = hashedPassword

			if (req.body.role) {
				req.body.role = Number(req.body.role)
			}
			const user = new Users(req.body)

			await user.save()

			const token = JWT.sign(
				{ email: user.email, id: user._id, role: user.role },
				JWT_SECRET_KEY,
				{ expiresIn: '1h' }
			)

			const { password, ...otherDetails } = user._doc

			res.status(201).json({ user: otherDetails, token })
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	},

	signIn: async (req, res) => {
        console.log(req.body);
        
		const { login = '', password = '' } = req.body || {}
		if (!login || !password) {
			return res
				.status(400)
				.json({ message: 'Login and password are required!' })
		}

		try {
			const existingUser = await Users.findOne({ login })
			if (!existingUser) {
				return res.status(400).json({ message: 'Invalid email or password!' })
			}

			const isPasswordCorrect = await bcrypt.compare(
				password,
				existingUser.password
			)
			if (!isPasswordCorrect) {
				return res.status(400).json({ message: 'Invalid email or password!' })
			}

			const token = JWT.sign(
				{ id: existingUser._id, role: existingUser.role },
				process.env.JWT_SECRET_KEY,
				{ expiresIn: '1h' }
			)

			const { password, ...otherDetails } = existingUser._doc || existingUser
			return res.status(200).json({ user: otherDetails, token })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = authCtrl
