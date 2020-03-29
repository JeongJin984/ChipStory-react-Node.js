const express = require('express')
const db = require('./models')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const dotenv = require('dotenv')
const passport = require('passport')

const app = express()
db.sequelize.sync()

const passportConfig = require('./passport')
const userAPIRouter = require('./routes/user')
const postAPIRouter = require('./routes/post')
const postsAPIRouter = require('./routes/posts')
const hashtagAPIRouter = require('./routes/hashtag')
dotenv.config()
passportConfig()

const prod = process.env.NODE_ENV === 'production';

//middle-ware
app.use(morgan('dev'))
app.use('/', express.static('uploads'))
app.use('/profile/', express.static('profileImage'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
	origin: true,
	credentials: true
}))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(expressSession({
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		secure: false
	},
	name: 'rnbck'
}))
app.use(passport.initialize())
app.use(passport.session())
 

//router
app.use('/api/user', userAPIRouter)
app.use('/api/post', postAPIRouter)
app.use('/api/posts', postsAPIRouter)
app.use('/api/hashtag', hashtagAPIRouter)

app.get('/', (req, res) => {
	res.send('Hello Server')
})

app.listen(prod ? process.env.PORT : 3065, () => {
	console.log(`server is running on localhost:${process.env.PORT}`);
})