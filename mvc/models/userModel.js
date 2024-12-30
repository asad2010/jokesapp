const mongoose = require('mongoose')
const UserSchema = mongoose.Schema(
	{
        login: {
            type: String,
            unique: true,
            required: true,
        },
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		role: {
			type: Number,
			default: 100,
			enum: [100, 101], // 100-user, 101-admin,
		},
		about: String
	},
	{ timestamps: true }
)
module.exports = mongoose.model('User', UserSchema)
