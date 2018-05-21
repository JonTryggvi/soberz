const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const jConfig = require('../config.js')
const path = require('path')
const moment = require('moment');
const time = moment();
const time_format = time.format('YYYY-MM-DD HH:mm:ss Z');
// console.log(time_format);

let request = require('request');


sendSmsData = function (req, res, userData) {

  const sMobile = req.fields.tel
  const sMobielNoCode = sMobile.substring(3)
  const iMobile = Number(sMobielNoCode)
  const sMessage = "Hi " + userData[1] + " please click this link to activate your account. You will be redirected to the loggin page: " + serverpath +"/api/auth-signin/" + userData[0]
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
      // if (body.status == 'ok')
    
      
    })
} 


/******************************************************************************************************* */
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
        const jError = {status: 'failed', message: 'updateUserbyField query failed ' + err}
        return res.json(jError)
      }
      let dataValueChecked;
      if (isJson(dataValue)) {
        dataValueChecked = JSON.parse(dataValue);

      } else {
        dataValueChecked = dataValue
      }

      const jSuccess = { status: 'ok', message: 'userfield: ' + columnName + ' has been updateed', updatedData: { name: columnName, userId: userId, value: dataValueChecked}}
      return res.json(jSuccess)
      // next()
    })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> updateUserByField function' }
    gLog('err', err.message + ' -> ' + err.where)
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
    const new_path = path.join(process.env.PWD, '/uploads/img/', file_name + '.' + file_ext)
    const prevFile = req.fields.oldFile
    // console.log(prevFile);
    
    gFs.readFile(old_path, function (err, data) {
      gFs.writeFile(new_path, data, function (err) {
        gFs.unlink(old_path, function (err) {
          if (err) {
            res.status(500)
            return res.json({ 'success': false })
          } 
          if (prevFile && gFs.existsSync('.' + prevFile)) {
            gFs.unlink('.' + prevFile, (err) => {
              if (err) {
                gLog('err', err)
                return false
              }
              return true
            });
          }
          res.status(200);
          const imgPath = '/uploads/img/' + file_name + '.' + file_ext
          return res.json({ 'success': true, 'imgPath': imgPath, 'imgId': file_name });
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
    // console.log(fileToDelete.filePath)
    // console.log(gFs.existsSync('.'+fileToDelete.filePath));
    if (gFs.existsSync('.' + fileToDelete.filePath)) {
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
      next()
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
      res.send(ajRows)
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
        gLog('err', jError)
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
          next()
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

jUser.saveUser = function (req, res, next) {
  try {
    const code = random4Digit();
    const jUserData = req.fields
    const sjUserImg = jUserData.userImg
    const aParams = [jUserData.firstname, jUserData.lastname, jUserData.username, jUserData.email, jUserData.tel, jUserData.gender, jUserData.isSponsor, sjUserImg, jUserData.password, time_format, code]
    stmt = 'INSERT INTO Users (firstname, lastname, username, email, mobile, gender, sponsor, imgUrl, password, date, code ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    db.run(stmt, aParams, function (err, data) {
      if (err) {
        console.log(err);
        return res.send(err)
      }
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
          text: 'Hi, '+jUserData.firstname+' please click the link to activate your account. You will be sent to the login page',
          html: '<p>Hi, ' + jUserData.firstname + ' please click the link to activate your account. You will be sent to the login page</p><a href="' + serverpath+'/api/auth-signin/'+code+'">Activate account</a>'
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error)
          }
          gLog('info', 'message sent: %s', info.messageId)
          gLog('info', 'Preview URL: %s', nodemailer.getTestMessageUrl(info))
        })
      })

      
      smsData.sendSmsData(req ,res , [code, jUserData.firstname])

      res.status(200)
      const jSuccess = { status: 'ok', message: 'user: ' + jUserData.username + ' has been added' }
      res.send(jSuccess)
    })
  } catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> getGenders function' }
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
      gLog('ok', 'test ' + dbResponse)
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
      return res.send(dbData)
      // const pendintableID = this.lastID
      // const stmt2 = 'SELECT json_extract(pending_sponsor_request, "$") As pending FROM Users WHERE id = ' + sponsorId
      // db.all(stmt2, function (err, aData) {
      //   if (err) {
      //     const jError = { error: err, message: 'the database inner pending sponsor SELECT query failed' }
      //     gLog('err', jError.error + ' -> ' + jError.message);
      //     return res.status(500).json(jError)
      //   }
      //   let aPrePending = aData !== undefined | null ? JSON.parse(aData[0].pending) : []
      //   // console.log(typeof aPrePending)
      //   aPrePending.push(pendintableID)
      //   sPrePending = JSON.stringify(aPrePending)
      //   // console.log(aPrePending);
      //   const stmt3 = 'UPDATE Users SET pending_sponsor_request = json_set(pending_sponsor_request, "$", ?) WHERE id = ?' 
      //   const params2 = [sPrePending, sponsorId]
      //   db.run(stmt3, params2, function (err, db) {
      //     if (err) {
      //       const jError = { error: err, message: 'the database inner Set updating sponsor pending messages query failed' }
      //       gLog('err', jError.error + ' -> ' + jError.message);
      //       return res.status(500).json(jError)
      //     }
          
      //   })
      //   // do the same here but for the sent_pending_requests
      //   const stmt4 = 'SELECT json_extract(sent_sponsor_request, "$") As sponsorRequest FROM Users WHERE id = ' + sponseeId
      //   db.all(stmt4, function (err, aData) {
      //     if (err) {
      //       const jError = { error: err, message: 'the database sponsee inner SELECT query failed' }
      //       gLog('err', jError.error + ' -> ' + jError.message);
      //       return res.status(500).json(jError)
      //     }
      //     let aPrePending = aData !== undefined | null ? JSON.parse(aData[0].sponsorRequest) : []
      //     aPrePending.push(pendintableID)
      //     sPrePending = JSON.stringify(aPrePending)
      //     // console.log(aPrePending);
      //     const stmt3 = 'UPDATE Users SET sent_sponsor_request = json_set(sent_sponsor_request, "$", ?) WHERE id = ?'
      //     const params2 = [sPrePending, sponseeId]
      //     db.run(stmt3, params2, function (err, db) {
      //       if (err) {
      //         const jError = { error: err, message: 'the database inner Set updating sponsor pending messages query failed' }
      //         gLog('err', jError.error + ' -> ' + jError.message);
      //         return res.status(500).json(jError)
      //       }
      //       // do the same here but for the sent_pending_requests
      //       return res.send(db)
      //     })

      //     // console.log(this.lastID);

      //   })
      //   // console.log(this.lastID);
        
      // })

    
      
    })
   
  } catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> saveSponceRequest function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

module.exports = jUser 