const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
	res.render('index', {
		title: 'IShowspeed color jokes',
		body: '../pages/home',
	})
})

router.get('/about', (req, res) => {
	res.render('index', {
		title: 'About Me',
		body: '../pages/about',
	})
})

router.get('/addJokes', (req, res) => {
	res.render('index', {
		title: 'Add and Edit Jokes',
		body: '../pages/addJokes',
	})
})

module.exports = router
