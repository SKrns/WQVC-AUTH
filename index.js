const express = require('express')
const dotenv = require('dotenv')
const session = require('express-session')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
const cors = require('cors');

let app = express()
dotenv.config()

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use(session({
	key: 'sid',
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
	}
}))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

const user_router = require('./routes/user')(app)
const conference_router = require('./routes/conference')(app)
const main_router = require('./routes/main')(app)


let server = app.listen(process.env.PORT, () => {
 console.log("Express server has started on port %d", process.env.PORT)
})


