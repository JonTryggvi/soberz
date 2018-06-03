const emitter = require('events')
emitter.EventEmitter.prototype._maxListeners = 100;
const express = require('express')
const app = express()
const http = require('http').Server(app)
var path = require('path');
const socketIO = require('socket.io')
const io = socketIO(1984)
const sqlite3 = require('sqlite3')

global.formidable = require('express-formidable')
global.chalk = require('chalk')
global.db = new sqlite3.Database(__dirname + '/data.db')
global.config = require('./config'); // get our config file
global.gFs = require('fs')
global.crypto = require('crypto');

global.port = process.env.PORT || 1983
global.serverpath = 'http://127.0.0.1:' + port

app.use(formidable())
app.use(express.static(__dirname + '/dist'))
app.set('superSecret', config.secret)

const mongo = require('mongodb').MongoClient;
var sDataBaseName = "socketChat"
var sDatabasePath = 'mongodb://127.0.0.1:27017/' 

// ****************************************************************************************************

const users = require(__dirname + '/controllers/users.js')

// ****************************************************************************************************
global.gLog = (sStatus, sMessage) => {
  switch (sStatus) {
    case 'ok':
      console.log(chalk.black.bgGreen(sMessage))  
      break
    case 'err':
      console.log(chalk.black.bgRed(sMessage))
      break 
    case 'ex':
      console.log(chalk.magenta(sMessage))
      break
    case 'info':
      console.log(chalk.blue(sMessage))
      break
  }
}

//  ****************************************************************************************************
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next() 
}); 

//  ****************************************************************************************************

app.use('/public', express.static(__dirname + '/public'))

// making shure we have a uploads directory 
var dirUP = __dirname+'/public/uploads';
var dirImg = __dirname+'/public/uploads/img'
if (!gFs.existsSync(dirUP)) {
  gFs.mkdirSync(dirUP); 
}
if (!gFs.existsSync(dirImg)) {
  gFs.mkdirSync(dirImg)
}

//  ****************************************************************************************************

const fronEndRoutes = express.Router()
app.use('/', fronEndRoutes)
fronEndRoutes.get('/*', function (req, res, next) {
/** this is where the angular client is running  when I have a live server running this will change to a res.sendFile(path/to/dist/index.html) */
  
  return res.sendFile(__dirname + '/public/dist/index.html')
  // return res.redirect('http://localhost:4200') 
  next()
})

//  ****************************************************************************************************

const apiRoutes = express.Router()
// update user by choosed field on client side
apiRoutes.put('/update-user-field', function (req, res, next) {
  users.updateUserbyField(req, res, next);
})

apiRoutes.post('/auth-user', function (req, res, next) {
  users.logInUser(req, res, next)
})

apiRoutes.get('/get-genders', function (req, res, next) {
  users.getGenders(req, res, next)
})

apiRoutes.post('/save-user', function (req, res, next) {
  users.saveUser(req, res, next)
})

// user has signed up but needs to activate him/her self by either clicking a link in sms or email
apiRoutes.get('/auth-signin/:code', function (req, res) {
  users.authSignin(req, res)
})

apiRoutes.post('/save-file', function (req, res, next) {
  users.saveFile(req, res, next)

})

apiRoutes.post('/logout-user', function (req, res, next) {
  users.logoutUser(req, res, next);
})

apiRoutes.use(function (req, res, next) {
  users.verifyUsers(req, res, next)
})

apiRoutes.post('/delete-file', function (req, res, next) {
  users.deleteFile(req, res, next)
})

apiRoutes.post('/post-sponsor-request', function (req, res) {
  users.saveSponceRequest(req, res)
})

apiRoutes.get('/get-users', function (req, res, next) {
  users.getAllUsers(req, res, next)
})



apiRoutes.get('/', function (req, res, next) {
  try {
    return res.status(200).json({ message: 'ok', v: req.decoded, token: req.token, userId: req.userId, status:'ok' })
    next()
  } catch (error) {
    return res.status(500).json({ message: 'Could not get this address', status: 'error' })
    next()
  }
})

app.use('/api', apiRoutes)

//  ****************************************************************************************************

io.on('connection', (socket) => {
  try {
    // console.log(socket.conn.server.clients)
    // console.log('user connected');
    gLog('ext', 'user connected')
    socket.on('new-message', (message) => {
      // console.log(message)
      io.emit('new-message', message)
    })

    socket.on('userActive', function(activeUserId) {
      socketInfo = {
        activeUserId: activeUserId,
        socketId: socket.id
      }
      console.log(socketInfo)
      io.emit('userActive', socketInfo)
    })

    socket.on('disconnect', function () {
      console.log(socket.id + ' disconnected')
      io.emit('disconnected', socket.id);
    })

  } catch (error) {
    gLog('err', 'Would not connect to socket: '+ error.message)
  }
  
});

//  ****************************************************************************************************

http.listen(port, err => {
  if (err) {
    gLog(err, 'cannot use port: ' + port)
    return
  }
  gLog('ok', 'server is listening on port: ' + port)
})
