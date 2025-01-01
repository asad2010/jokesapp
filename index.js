const express = require('express')
const app = express()
const fs = require('fs')
require('dotenv').config()
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const path = require('path')

// routers
const jokesRouter = require('./mvc/routers/jokesRouter')
const authRouter = require('./mvc/routers/authRouter')
const userRouter = require('./mvc/routers/userRouter')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layouts/main')
app.use('/', jokesRouter)
app.use('/auth', authRouter)
app.use('/', userRouter)

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT
mongoose
	.connect(MONGO_URL, {
		family: 4,
	})
	.then(() => {
		app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
	})
	.catch(error => console.log(error))
