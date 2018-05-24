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
      const pendintableID = this.lastID
      const stmt2 = 'SELECT json_extract(pending_sponsor_request, "$") As pending FROM Users WHERE id = ' + sponsorId
      db.all(stmt2, function (err, aData) {
        if (err) {
          const jError = { error: err, message: 'the database inner pending sponsor SELECT query failed' }
          gLog('err', jError.error + ' -> ' + jError.message);
          return res.status(500).json(jError)
        }
        let aPrePending = aData !== undefined | null ? JSON.parse(aData[0].pending) : []
        // console.log(typeof aPrePending)
        aPrePending.push(pendintableID)
        sPrePending = JSON.stringify(aPrePending)
        // console.log(aPrePending);
        const stmt3 = 'UPDATE Users SET pending_sponsor_request = json_set(pending_sponsor_request, "$", ?) WHERE id = ?'
        const params2 = [sPrePending, sponsorId]
        db.run(stmt3, params2, function (err, db) {
          if (err) {
            const jError = { error: err, message: 'the database inner Set updating sponsor pending messages query failed' }
            gLog('err', jError.error + ' -> ' + jError.message);
            return res.status(500).json(jError)
          }

        })
        // do the same here but for the sent_pending_requests
        const stmt4 = 'SELECT json_extract(sent_sponsor_request, "$") As sponsorRequest FROM Users WHERE id = ' + sponseeId
        db.all(stmt4, function (err, aData) {
          if (err) {
            const jError = { error: err, message: 'the database sponsee inner SELECT query failed' }
            gLog('err', jError.error + ' -> ' + jError.message);
            return res.status(500).json(jError)
          }
          let aPrePending = aData !== undefined | null ? JSON.parse(aData[0].sponsorRequest) : []
          aPrePending.push(pendintableID)
          sPrePending = JSON.stringify(aPrePending)
          // console.log(aPrePending);
          const stmt3 = 'UPDATE Users SET sent_sponsor_request = json_set(sent_sponsor_request, "$", ?) WHERE id = ?'
          const params2 = [sPrePending, sponseeId]
          db.run(stmt3, params2, function (err, db) {
            if (err) {
              const jError = { error: err, message: 'the database inner Set updating sponsor pending messages query failed' }
              gLog('err', jError.error + ' -> ' + jError.message);
              return res.status(500).json(jError)
            }
            // do the same here but for the sent_pending_requests
            return res.send(db)
          })
          // console.log(this.lastID)
        })
        // console.log(this.lastID);
      })
    })
  } catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> saveSponceRequest function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}