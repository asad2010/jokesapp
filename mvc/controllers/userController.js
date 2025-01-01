const bcrypt = require('bcrypt')
const Users = require('../models/userModel')

const userCtrl = {
	getUser: async (req, res) => {
		const { id } = req.params
		try {
			const user = await Users.findById(id)
			if (user) {
				const { password, ...other } = user._doc
				return res.status(200).json(other)
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	},
	getAllUsers: async (req, res) => {
		try {
			const users = Users.find()
			if (users) {
				let users = await Users.find()
				users = users.map(user => {
					const { password, ...otherDetails } = user._doc
					return otherDetails
				})

				return res.status(200).json(users)
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	},
	updUser: async (req, res) => {
		const { id } = req.params
		const { firstname, lastname, email } = req.body
		try {
			if (!id) return res.status(400).json({ message: 'User ID is required' })
			const hashedPassword = req.body.password
				? await bcrypt.hash(req.body.password, 12)
				: undefined

			const updateData = { firstname, lastname, email }
			if (hashedPassword) {
				updateData.password = hashedPassword
			}
			const updatedUser = await Users.findByIdAndUpdate(id, updateData, {
				new: true,
			})

			if (!updatedUser)
				return res.status(404).json({ message: 'User not found' })
			const { password, ...otherDetails } = updatedUser._doc
			res
				.status(200)
				.json({ message: 'User updated successfully', otherDetails })
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	},
	delUser: async (req, res) => {
		const { id } = req.params
		try {
			const existingUser = await Users.findByIdAndDelete(id)
			if (!existingUser)
				return res.status(404).json({ message: 'User not exists' })

			res.status(200).json({ message: 'User deleted successfully' })
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	},
}

module.exports = userCtrl
