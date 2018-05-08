const express = require('express')
const app = express()
// var http = require('http').Server(app)
const chalk = require('chalk')
const sqlite3 = require('sqlite3')
global.formidable = require('express-formidable')
app.use(formidable())


global.db = new sqlite3.Database(__dirname + '/data.db')
global.config = require('./config'); // get our config file
global.gFs = require('fs')
// app.use(fileUpload())


app.set('superSecret', config.secret)


process.setMaxListeners(Infinity);
// console.log(process.argv);
// var setup = () => {
//   // console.log('SETTING VARIABLES')
//   iHttpPort = process.argv[process.argv.indexOf('--HTTP') + 1]
//   iHttpsPort = process.argv[process.argv.indexOf('--HTTPS') + 1]
//   console.log(iHttpPort);

// }
// setup()
// ****************************************************************************************************

var users = require(__dirname + '/controllers/users.js')

// ****************************************************************************************************

// ****************************************************************************************************
global.gLog = (sStatus, sMessage) => {
  switch (sStatus) {
    case 'ok':
      console.log(chalk.green(sMessage))  
      break
    case 'err':
      console.log(chalk.red(sMessage))
      break 
    case 'ex':
      console.log(chalk.magenta(sMessage))
      break
    case 'info':
      console.log(sMessage)
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

const fronEndRoutes = express.Router()
console.log(__dirname );

app.use( '/uploads', express.static(__dirname + '/uploads' ))

fronEndRoutes.get('/', function (req, res, next) {
  res.redirect('http://localhost:4200');
})
app.use('/', fronEndRoutes)

//  ****************************************************************************************************

const apiRoutes = express.Router()
apiRoutes.post('/auth-user', function (req, res, next) {
  users.logInUser(req, res, next)
})
apiRoutes.get('/get-genders', function (req, res, next) {
  users.getGenders(req, res, next)
})

apiRoutes.post('/save-user', function (req, res, next) {
  users.saveUser(req, res, next)
})

apiRoutes.post('/save-file', function (req, res, next) {
  users.saveFile(req, res, next)
})

apiRoutes.use(function (req, res, next) {
  users.verifyUsers(req, res, next)
})

apiRoutes.get('/get-users', function (req, res, next) {
  users.getAllUsers(req, res, next)
})

apiRoutes.get('/', function (req, res, next) {
  try {
    res.json({ message: 'ok', v: req.decoded, token: req.token, userId: req.userId })
  } catch (error) {
    res.json({message: 'Could not get this address'})
  }
  
})

app.use('/api', apiRoutes)

//  ****************************************************************************************************

var port = 1983
app.listen(port, err => {
  if (err) {
    gLog(err, 'cannot use port: ' + port)
    return
  }
  gLog('ok', 'server is listening on port: ' + port)
})