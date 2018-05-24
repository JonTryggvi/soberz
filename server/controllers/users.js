const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const jConfig = require('../config.js')
const path = require('path')
const moment = require('moment')
const time = moment()
const time_format = time.format('YYYY-MM-DD HH:mm:ss Z')
const fetch = require('node-fetch')
let request = require('request');


/*****************************************Async vs promise test********************************************** */

function logFetch(url) {
  return fetch(url)
    .then(response => response.json())
    .then(text => {
      gLog('info', text.value + chalk.black.bgGreen(' with PROMISE '));
    }).catch(err => {
      gLog('err', err.messge)
    });
}
// logFetch('https://api.chucknorris.io/jokes/random')

async function logFetchAsync(url) {
  try {
    const response = await fetch(url)
    const jResponse = await response.json()
    const sChuckyJodke = await jResponse.value
    gLog('ex',sChuckyJodke + chalk.black.bgGreen(' with ASYNC '))
  }
  catch (err) {
    gLog('err', err.message)
  }
}

// logFetchAsync('https://api.chucknorris.io/jokes/random')


/******************************************************************************************************* */
sendSmsData = function (req, res, userData) {
  try {
    const sMobile = req.fields.tel
    const sMobielNoCode = sMobile.substring(3)
    const iMobile = Number(sMobielNoCode)
    const userName = userData[1]
    const sMessage = `Welcome to Soberz ${userName}!!Click to activate:${serverpath}/api/auth-signin/${userData[0]}`
    const apiToken = '$2y$10$.ChyTpLaho/NlaEFtu7bMebks1C/Q.yn6/JTJ6WaTZRHGMjMnQTCq';

    request.post({
      url: 'http://smses.io/api-send-sms',
      form: {
        apiToken: apiToken,
        mobile: iMobile,
        message: sMessage,
      }
    },
      function (err, httpResponse, body) {
        console.log(body)
        if (err) {
           return false
        }
        return true;

      })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> sendSmsData stand alone function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
 
} 
  
function random4Digit() {
  return shuffle("0123456789".split('')).join('').substring(0, 4);
}
function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
/******************************************************************************************************* */


const jUser = {}
jUser.message = {}

jUser.updateUserbyField = function (req, res, next) {
  try {
    // console.log(req.fields);
    const columnName = req.fields.name
    let dataValue = req.fields.value
    const userId = req.fields.userId
    const stmt = 'UPDATE Users SET ' + columnName + ' = ? WHERE Users.id = ?';
    const params = [dataValue, userId]
    // console.log(params);
    
    db.run(stmt, params, function (err) {
      if (err) {
        const jError = { status: 'failed', message: 'updateUserbyField query failed ' + err }
        return res.status(500).json(jError)
      }
      let dataValueChecked;
      if (isJson(dataValue)) {
        dataValueChecked = JSON.parse(dataValue);
      } else {
        dataValueChecked = dataValue
      }
      const jSuccess = { status: 'ok', message: 'userfield: ' + columnName + ' has been updateed', updatedData: { name: columnName, userId: userId, value: dataValueChecked}}
      return res.status(200).json(jSuccess)
      next() // needed to work with the authentication 
    })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> updateUserByField function' }
    gLog('err', err.message + ' -> ' + err.where)
    return res.status(500).json(err)
  }
}

jUser.saveFile = function (req, res, next) {
  // const sImgPath = req.files.userImg.path
  // const fileName = req.files.userImg.name
  try {
    
    const old_path = req.files.userImg.path
    const file_size = req.files.userImg.size
    const file_ext = req.files.userImg.name.split('.').pop()
    const index = old_path.lastIndexOf('/') + 1
    const file_name = old_path.substr(index)
    const new_path = path.join(process.env.PWD, '/dist/uploads/img/', file_name + '.' + file_ext)
    const prevFile = req.fields.oldFile
    // console.log(prevFile);

    //  perhaps try with async await or promise methood
    gFs.readFile(old_path, function (err, data) {
      if (err) {
        const error = { message: err.message, where: 'controllers/users.js -> saveFile entering callback hell' }
        gLog('err', error.message + ' -> ' + error.where)
        return false;
      }
      gFs.writeFile(new_path, data, function (err) {
        if (err) {
          const error = { message: err.message, where: 'controllers/users.js -> saveFile -> writefile ' }
          gLog('err', error.message + ' -> ' + error.where)
          return false;
        }
        gFs.unlink(old_path, function (err) {
          if (err) {
            const error = {success: false, message: err.message, where: 'controllers/users.js -> saveFile -> writefile -> unlink' }
            gLog('err', error.message + ' -> ' + error.where)
            return res.status(500).json(error)
          } 
          if (prevFile && gFs.existsSync('.' + prevFile)) {
            gFs.unlink('.' + prevFile, (err) => {
              if (err) {
                const error = { success: false, message: err.message, where: 'controllers/users.js -> saveFile -> writefile -> unlink -> unlink' }
                gLog('err', error.message + ' -> ' + error.where)
                return res.status(500).json(error)
              }
              return true
            });
          }
          res.status(200);
          const imgPath = '/uploads/img/' + file_name + '.' + file_ext
          const success = { 'success': true, 'imgPath': imgPath, 'imgId': file_name }
          return res.json(success);
          next()
        });
      });
    });

  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> saveFile function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

jUser.deleteFile = function (req, res, next) {
  try {
    const fileToDelete = req.fields
    const boolFileExists = gFs.existsSync('.' + fileToDelete.filePath)
    if (boolFileExists) {
      gFs.unlink('.' + fileToDelete.filePath, (err) => {
      if (err) {
        gLog('err', err)
        return false
      }
      return res.send(fileToDelete + ' was deleted')
        next()
      });
    } 
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> deleteFile function' }
    gLog('err', err.message + ' -> ' + err.where)    
  }
}

jUser.getAllUsers = function (req, res, next) {
  try {
    const stmt = "SELECT about, json_extract(a.imgUrl, '$') AS userImg, json_extract(a.sponsors, '$') AS sponsors, json_extract(a.sponsees, '$') AS sponsees, a.id, a.email, a.firstname, a.lastname, a.mobile, a.sponsor, a.username, a.online, a.activated, b.gender_name AS gender, c.role_name AS role FROM Users AS a INNER JOIN genders  AS b ON (a.gender = b.id) INNER JOIN user_roles AS c ON (a.user_role = c.role_id) WHERE a.activated = 1"
    db.all(stmt, function (err, ajRows) {
      if (err) {
        const jError = { message: 'could not read from database', error: err }
        const jClientErr = { message: 'server error, contact system admin' }
        const error = { message: err.message, where: 'controllers/users.js -> db.all function' }
        gLog('err', error.message + ' -> ' + error.where)
        return res.send(jClientErr)
      }
      gLog('ex', res.headersSent + ' getUsers function')
      return res.send(ajRows)
      next() // needed for auth headers
    })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> getAllUsers function' }
    gLog('err', err.message + ' -> ' + err.where)
  } 
} 

jUser.getGenders = function (req, res) {
  try {
    const stmt = 'SELECT * FROM genders'
    db.all(stmt, function (err, ajRows) {
      if (err) {
        gLog('err', 'could not connect to the genders table')
        return true
      }
      return res.send(ajRows)
    })
  }
  catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> getGenders function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

jUser.logInUser = function(req, res, next) {
  try {
    const password = req.fields.password //'123#$%'
    const email = req.fields.user //'jontryggvi@jontryggvi.is'
    
    // const stmt = "SELECT id, user_role, sponsor FROM Users WHERE email = ? AND password = ?"
    const stmt = "SELECT Users.id, Users.activated, user_roles.role_name FROM Users INNER JOIN user_roles ON Users.user_role = user_roles.role_id  WHERE email = ? AND password = ?"

    db.get(stmt, [email, password], function (err, jRow) {
      gLog('ex', res.headersSent + ' before')
      // db.close()
      if (err) {
        const jError = { error: err, message: 'the database query failed' }
        gLog('err', jError.err)
        const sjError = JSON.stringify(jError)
        return res.json(sjError)
      }
      gLog('ex', res.headersSent + ' between')
      if (jRow && jRow.activated) { 
        
        const payload = {
          admin: true
        };

       const secret = jConfig.secret;
        var token = jwt.sign(payload, secret, {
          expiresIn: "2h" // expires in 2 hours
        });
        const jRes = { message: 'ok', response: jRow, token: token }
        jUser.message = jRes
        return res.json(jRes)
    
        gLog('ex', res.headersSent + ' after')
      } else {
        const jRes = { message: 'no match or user is not authenticated', response: jRow }
        
        return res.status(500).json(jRes)

      }
    })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> logInUser function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

jUser.verifyUsers = function (req, res, next) {
  try {
    // check header or url parameters or post parameters for token
    const userId = req.query.userId
    // console.log(userId);
    const token = req.fields.token || req.query.token || req.headers['x-access-token']
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, jConfig.secret, function (err, decoded) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Failed to authenticate token.' })
        } else {
          req.token = token
          req.decoded = decoded
          req.userId = userId
          next() //needed for the auth process
        }
      });

    } else {
      // if there is no token
      return res.send({
        success: false,
        message: 'No token provided.'
      });
    }
  } catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> verifyUsers function' }
    gLog('err', err.message+ ' -> ' + err.where)
  }
}

jUser.saveUser = async function (req, res, next) {
  try {
    const code = random4Digit();
    const jUserData = req.fields
    const sjUserImg = jUserData.userImg
    const aParams = [jUserData.firstname, jUserData.lastname, jUserData.username, jUserData.email, jUserData.tel, jUserData.gender, jUserData.isSponsor, sjUserImg, jUserData.password, time_format, code]
    stmt = 'INSERT INTO Users (firstname, lastname, username, email, mobile, gender, sponsor, imgUrl, password, date, code ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    db.run(stmt, aParams, async function (err, data) {
      
      try {
        nodemailer.createTestAccount((err, account) => {
          if (err) {
            return console.log(err)

          }
          let transporter = nodemailer.createTransport({
            host: 'mail.1984.is',
            port: 587,
            secure: false,
            auth: {
              user: 'jontryggvi@jontryggvi.is',
              pass: '23Sandfell27'
            }
          })
          let mailOptions = {
            from: '"Soberz"<jontryggvi@jontryggvi.is>',
            to: jUserData.email,
            subject: 'howdy ' + jUserData.firstname,
            text: 'Hi, ' + jUserData.firstname + ' please click the link to activate your account. You will be sent to the login page',
            html: '<p>Hi, ' + jUserData.firstname + ' please click the link to activate your account. You will be sent to the login page</p><a href="' + serverpath + '/api/auth-signin/' + code + '">Activate account</a>'
          }

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error)
            }
            gLog('info', 'message sent: %s', info.messageId)
            gLog('info', 'Preview URL: %s', nodemailer.getTestMessageUrl(info))
          })
        })
        sendSmsData(req, res, [code, jUserData.firstname])

        res.status(200)
        const jSuccess = { status: 'ok', message: 'user: ' + jUserData.username + ' has been added' }
        res.send(jSuccess)
      } catch (error) {
        // if (err)
        {
          console.log(error);
          return res.send(error.message)
        }
      }
     
    })
  } catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> saveUser function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

jUser.authSignin = function (req, res) {
  try {
    const code = req.params.code
    const activated = 1
    const stmt = 'UPDATE Users SET activated = ? WHERE code = ?'
    const params = [activated, code]
    db.run(stmt, params, function (err, dbResponse) {
      if (err) {
        return res.status(500).send(err)
      }
      gLog('ok', 'user Activated' )
      return res.status(200).redirect('http://localhost:4200')
      
    })
  } catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> authSignin function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

jUser.saveSponceRequest = function (req, res) {
  try {
    const sponsorId = req.fields.sponsorId
    const sponseeId = req.fields.userId
    const reqDate = new Date()
    const stmt = 'INSERT OR IGNORE INTO sponsor_inquiries (who_is_asking, who_is_asked, date ) VALUES(?, ?, ?)'
    const params = [sponseeId, sponsorId, reqDate]
    db.run(stmt, params, function (err, dbData) {
      if (err) {
        const jError = { error: err, message: 'the INSERT INTO sponsor_inquiries query failed' }
        gLog('err', jError.error + ' -> ' + jError.message);
        return res.status(500).json(jError)
      }
      return res.status(200).send(dbData)
    })
    return
  } catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> saveSponceRequest function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

module.exports = jUser 