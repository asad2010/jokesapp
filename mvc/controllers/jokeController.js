const Jokes = require('../models/jokeModel')

const jokeCtrl = {
	getJokes: async (req, res) => {
		const page = parseInt(req.query.page) || 1
		const pageSize = 4
		const skip = (page - 1) * pageSize
		try {
			Jokes.countDocuments().then(async totalJokes => {
				const totalPages = Math.ceil(totalJokes / pageSize)

				await Jokes.find()
					.populate('addedBy', 'login')
					.skip(skip)
					.limit(pageSize)
					.then(jokes => {
						res.render('index', {
							title: 'JokesApp',
							body: '../pages/home',
							user: req.session.user,
							jokes,
							page,
							totalPages,
						})
					})
			})
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	},
	getJoke: async (req, res) => {
		const { id } = req.params
		try {
			const joke = await Jokes.findById(id).populate('addedBy', 'login')
			if (!joke) return res.redirect('/')

			res.render('index', {
				title: `${joke.addedBy.login}'s Joke `,
				body: '../joke',
				isFullScreen: true,
				user: req.session.user,
				joke,
			})
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	},
	addJoke: async (req, res) => {
		const { jokeText } = req.body
		try {
			if (!jokeText)
				return res.status(400).json({ message: 'Please enter a joke' })
			// console.log(req.session.user)
			const newJoke = new Jokes({ jokeText, addedBy: req.session.user.id })
			await newJoke.save()
			res.redirect('/')
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	},
	updJoke: async (req, res) => {
		const { id } = req.params
		const { rating, jokeText } = req.body
		const userId = req.session.user.id

		try {
			if (!rating && !jokeText) {
				return res
					.status(400)
					.json({ message: 'Please provide a rating or joke text.' })
			}

			const joke = await Jokes.findById(id)
			if (!joke) {
				return res.status(404).json({ message: 'Joke not found.' })
			}

			if (rating && joke.ratedBy.includes(userId)) {
				return res.redirect('/')
			}

			if (rating) {
				joke.totalRating += Number(rating)
				joke.votesCount += 1
				joke.ratedBy.push(userId)
			}

			if (jokeText) {
				joke.jokeText = jokeText.trim()
			}

			await joke.save()

			return res.redirect('/')
		} catch (err) {
			console.error(err)
			return res.status(500).json({ message: err.message })
		}
	},

	delJoke: async (req, res) => {
		const { id } = req.params
		try {
			const deletedJoke = await Jokes.findByIdAndDelete(id)
			if (!deletedJoke)
				return res.status(404).json({ message: 'Joke not found' })

			return res.redirect('/')
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	},
	searchJokes: async (req, res) => {
		const query = req.query.query || ''
		const page = parseInt(req.query.page) || 1
		const pageSize = 5
		const skip = (page - 1) * pageSize

		try {
			const [jokes, totalJokes] = await Promise.all([
				Jokes.find({ jokeText: { $regex: query, $options: 'i' } })
					.skip(skip)
					.limit(pageSize),
				Jokes.countDocuments({ jokeText: { $regex: query, $options: 'i' } }),
			])

			const totalPages = Math.ceil(totalJokes / pageSize)
			res.render('index', {
				title: 'JokesApp',
				body: '../pages/home',
				user: req.session.user,
				jokes,
				query,
				page,
				totalPages,
			})
		} catch (err) {
			console.error(err)
			res.status(500).send('Error searching jokes')
		}
	},
}

module.exports = jokeCtrl
