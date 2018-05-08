const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const jConfig = require('../config.js')
var path = require('path')
const jUser = {}
jUser.message = {}

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
          res.json({ 'success': true, 'imgPath': imgPath, 'imgId': file_name });
         
        });
      });
    });
  } catch (error) {
    gLog('err', 'savefile error: '+ error.message)
  }
}

jUser.getAllUsers = function (req, res) {
  try {
    const stmt = "SELECT json_extract(a.imgUrl, '$') AS userImg, json_extract(a.sponsors, '$') AS sponsors, json_extract(a.sponsees, '$') AS sponsees, a.id AS id, a.email, a.firstname, a.lastname, a.mobile, a.sponsor, a.username, b.gender_name AS gender, c.role_name AS role FROM Users AS a INNER JOIN genders  AS b ON (a.gender = b.id)  INNER JOIN user_roles AS c ON (a.user_role = c.role_id)"
    db.all(stmt, function (err, ajRows) {
      if (err) {
        gLog('err', {message: 'could not read from database', error: err})
      }
      res.send(ajRows)
    })
  } catch (error) {
    const err = {message: error.message}
    gLog('err', err)
  } 
} 
jUser.getGenders = function (req, res) {
  try {
    stmt = 'SELECT * FROM genders'
    db.all(stmt, function (err, ajRows) {
      if (err) {
        gLog('err', 'could not connect to the genders table')
        return
      }
      res.send(ajRows)
    })
  }
  catch (err) {

  }
}
jUser.logInUser = function(req, res, next) {
  try {
    const password = req.fields.password //'123#$%'
    const email = req.fields.user //'jontryggvi@jontryggvi.is'
    // const stmt = "SELECT id, user_role, sponsor FROM Users WHERE email = ? AND password = ?"
    const stmt = "SELECT users.id, user_roles.role_name FROM Users INNER JOIN user_roles ON users.id = user_roles.role_id WHERE email = ? AND password = ?"

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
          expiresIn: "2h" // expires in 24 hours
        });
        // req.userId = jRow.id
        // req.userRole = jRow.user_role
        jRes = { message: 'ok', response: jRow, token: token }
        jUser.message = jRes
        res.json(jRes)
        gLog('ex', res.headersSent + ' after')
      } else {
        jRes = { message: 'no match', response: jRow }
        
        res.json(jRes)
      }
    })
  } catch (error) {
    gLog('err', error.message)
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
          // if everything is good, save to request for use in other routes
          req.token = token
          req.decoded = decoded
          req.userId = userId
          next()
        }
      });

    } else {
      // if there is no token
      // return an error
      // took out res.status(403).send(...)
      return res.send({
        success: false,
        message: 'No token provided.'
      });
    }
  } catch (error) {
    gLog('err','verify error: ' + error.message)
  }
}

jUser.saveUser = function (req, res, next) {
  try {
    const jUserData = req.fields
    const sjUserImg = jUserData.userImg
    const aParams = [jUserData.firstname, jUserData.lastname, jUserData.username, jUserData.email, jUserData.tel, jUserData.gender, jUserData.isSponsor, sjUserImg, jUserData.password ]
    stmt = 'INSERT INTO Users (firstname, lastname, username, email, mobile, gender, sponsor, imgUrl, password ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
    db.run(stmt, aParams, function (err, data) {
      if (err) {
        console.log(err);
        return res.send(err)
      }
      res.send('ok')
    })
  } catch (error) {
    gLog('err', 'save user catch error: '+ error.message)
  }
}

module.exports = jUser 