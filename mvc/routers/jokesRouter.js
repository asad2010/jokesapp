const express = require('express')
const bodyParser = require('body-parser')
const jokeCtrl = require('../controllers/jokeController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', jokeCtrl.getJokes)

router.get('/about', async (req, res) => {

	res.render('index', {
		title: 'About Me',
		body: '../pages/about',
		user: req.session.user
	})
})

router.get('/addJoke', async (req, res) => {

	res.render('index', {
		title: 'Add and Edit Jokes',
		body: '../pages/addJokes',
		user: req.session.user,
	})
})
router.get('/search', authMiddleware, jokeCtrl.searchJokes)
router.get('/getJokes', authMiddleware, jokeCtrl.getJokes)
router.get('/jokes/:id', authMiddleware, jokeCtrl.getJoke)
router.post('/addJoke', authMiddleware, jokeCtrl.addJoke)
router.post('/updateJoke/:id', authMiddleware, jokeCtrl.updJoke)
router.post('/deleteJoke/:id', authMiddleware, jokeCtrl.delJoke)

module.exports = router
