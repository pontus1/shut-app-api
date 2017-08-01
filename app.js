var express = require('express')
var session = require('express-session')
var http = require('http')
var logger = require('morgan')
var path = require('path')
var bodyParser = require('body-parser')
var cors = require('cors')
var helmet = require('helmet')
require('dotenv').load()
var config = require('./config/server')
var rdb = require('./lib/rethink')  // FOR IO
const RDBStore = require('express-session-rethinkdb')(session)  // Setup Express to use RethinkDB as our storage session

var users = require('./routes/users')
var login = require('./routes/login')
var chat = require('./routes/chat')

var app = express()
var httpServer = http.createServer(app)
var host = config.host || 'localhost'
var port = config.port || 3000
var io = require('socket.io')(httpServer)

/*
 * Configuration for the rethinkdb session store
 */
var store = new RDBStore({
  // connection: rdb,
  connectOptions: {
    db: 'shut_app',
    discovery: false,
    pool: true,
    buffer: 50,
    max: 1000,
    timeout: 20,
    timeoutError: 1000
  },
  table: 'sessions',                  // Name of the table in which session data will be stored
  sessionTimeout: 86400000,           // sets time if not set in maxAge in cookie (1 day)
  flushInterval: 60000,               // This is the time interval in milliseconds between flushing of expired sessions (1 min)
  debug: false
})

/*
 * Session setup
 */
var sessionOptions = {
  name: 'chat-app-cookie',
  resave: false,
  store: store,                       // use the RDBStore
  saveUninitialized: false,
  secret: 'Shh, its a secret!',       // the secret used to sign the session ID cookie
  maxAge: 28800000                    // 8 hours.
}
/* FOR PRODUCTION ONLY */
if (app.get('env') === 'production') {
  app.set('trust proxy', 1)           // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

/*
 * Middlewhere
 */
app.use(session(sessionOptions))
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

/*
 * Session test (count page views)
 */
app.get('/', function (req, res) {
  if (req.session.page_views) {
    req.session.page_views++
    res.send('You visited this page ' + req.session.page_views + ' times')
  } else {
    req.session.page_views = 1
    res.send('Welcome to this page for the first time!')
  }
})

/*
 * Chat
 */
app.get('/chat', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

/*
 * Routes
 */
app.use('/users', users)
app.use('/login', login)
app.use('/chat', chat)

/*
 * Handle errors
 */
app.use(function (error, req, res, next) {
  res.status(error.status || 500)
  res.json({ error: error.message })
})

/*
 * SocketIO TODO: move elsewhere!
 */
io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})

io.on('connection', function (socket) {
  socket.on('chat message', function (msg) {
    // console.log('message: ' + msg)
    io.emit('chat message', msg)
  })
})

// io.on('new-message', function (msg) {
//   io.emit('chat message', msg.text)
// })


rdb.liveMessageUpdates(io)

/*
 * Start server
 */
httpServer.listen(port, host, function () {
  console.log('App is listening on http://%s:%s', host, port)
})


// var server = app.listen(3000, function () {
//   var host = server.address().address
//   var port = server.address().port
//
//     console.log('App is listening on http://%s:%s', host, port)
// })
