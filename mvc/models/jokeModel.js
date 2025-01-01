const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const jokeSchema = new mongoose.Schema({
	addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	jokeText: { type: String, required: true },
	totalRating: { type: Number, default: 0 }, 
	votesCount: { type: Number, default: 0 }, 
	ratedBy: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
})
jokeSchema.plugin(mongoosePaginate)
jokeSchema.virtual('rating').get(function () {
	return this.votesCount ? (this.totalRating / this.votesCount).toFixed(1) : 0
})

module.exports = mongoose.model('Joke', jokeSchema)