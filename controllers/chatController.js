var rdb = require('../lib/rethink')
// var auth = require('../lib/auth')
var error = require('../service/errors')

var sessionService = require('../service/session')

// module.exports.createMsg = function (req, res, next) {
//   var token = req.headers['x-api-token']
//   session.getAuthenticatedUser(token)
//     .then(function (result) {
//       res.json(result.name)
//       res.end()
//     })
// }

module.exports.createMsg = function (req, res, next) {
  sessionService.getAuthenticatedUser(req.headers['x-api-token'])
    .then(function (loggedInUser) {
      var msg = {
        text: req.body.text,
        created: Date.now(),
        author: loggedInUser.name
      }
      rdb.save('messages', msg)
        .then(function (result) {
          res.json(result)
        })
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}
