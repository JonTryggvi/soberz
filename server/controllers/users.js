const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const jConfig = require('../config.js')
const path = require('path')
const moment = require('moment');
const time = moment();
const time_format = time.format('YYYY-MM-DD HH:mm:ss Z');
// console.log(time_format);
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}


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
      if (isJson(dataValue)) {
        dataValue = JSON.parse(dataValue);
      } 
      const jSuccess = { status: 'ok', message: 'userfield: ' + columnName + ' has been updateed', updatedData: {name: columnName, userId: userId, value: dataValue}}
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

    gFs.readFile(old_path, function (err, data) {
      gFs.writeFile(new_path, data, function (err) {
        gFs.unlink(old_path, function (err) {
          if (err) {
            res.status(500)
            return res.json({ 'success': false })
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
    console.log(fileToDelete.filePath)
    console.log(gFs.existsSync('.'+fileToDelete.filePath));
    if (gFs.existsSync(fileToDelete.filePath)) {
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
    const stmt = "SELECT about, json_extract(a.imgUrl, '$') AS userImg, json_extract(a.sponsors, '$') AS sponsors, json_extract(a.sponsees, '$') AS sponsees, a.id, a.email, a.firstname, a.lastname, a.mobile, a.sponsor, a.username, a.online, b.gender_name AS gender, c.role_name AS role FROM Users AS a INNER JOIN genders  AS b ON (a.gender = b.id)  INNER JOIN user_roles AS c ON (a.user_role = c.role_id)"
    db.all(stmt, function (err, ajRows) {
      if (err) {
        const jError = { message: 'could not read from database', error: err }
        const jClientErr = {message: 'server error, contact system admin'}
        gLog('err', jError.message)
        return res.send(jClientErr)
      }
      gLog('ex', res.headersSent + ' getUsers function')
      res.send(ajRows)
      next()
    })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> getAllUsers function' }
    gLog('err', err.message + ' -> ' + err.where)
  } 
} 
jUser.getGenders = function (req, res) {
  try {
    stmt = 'SELECT * FROM genders'
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
    const stmt = "SELECT Users.id, user_roles.role_name FROM Users INNER JOIN user_roles ON Users.user_role = user_roles.role_id  WHERE email = ? AND password = ?"

    db.get(stmt, [email, password], function (err, jRow) {
      gLog('ex', res.headersSent + ' before')
      // db.close()
      if (err) {
        jError = { error: err, message: 'the database query failed' }
        gLog('err', jError)
        const sjError = JSON.stringify(jError)
        return res.json(sjError)
      }
      gLog('ex', res.headersSent + ' between')
      if (jRow) { 
        
        const payload = {
          admin: true
        };

       const secret = jConfig.secret;
        var token = jwt.sign(payload, secret, {
          expiresIn: "2h" // expires in 2 hours
        });
        jRes = { message: 'ok', response: jRow, token: token }
        jUser.message = jRes
        res.json(jRes)
        next()
        gLog('ex', res.headersSent + ' after')
      } else {
        jRes = { message: 'no match', response: jRow }
        
        res.json(jRes)
        next()
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
          return res.json({ success: false, message: 'Failed to authenticate token.' })
        } else {
          req.token = token
          req.decoded = decoded
          req.userId = userId
          next()
        }
         
         
        
          // if everything is good, save to request for use in other routes
     
        
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
    const jUserData = req.fields
    const sjUserImg = jUserData.userImg
    const aParams = [jUserData.firstname, jUserData.lastname, jUserData.username, jUserData.email, jUserData.tel, jUserData.gender, jUserData.isSponsor, sjUserImg, jUserData.password, time_format ]
    stmt = 'INSERT INTO Users (firstname, lastname, username, email, mobile, gender, sponsor, imgUrl, password, date ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    db.run(stmt, aParams, function (err, data) {
      if (err) {
        console.log(err);
        return res.send(err)
      }
      res.status(200)
      const jSuccess = { status: 'ok', message: 'user: ' + jUserData.username + ' has been added' }
      res.send(jSuccess)
    })
  } catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> getGenders function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

module.exports = jUser 