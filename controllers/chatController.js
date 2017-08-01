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

/*
 * Post chat message
 */
module.exports.createMsg = function (req, res, next) {
  sessionService.getAuthenticatedUser(req.headers['x-api-token'])
    .then(function (loggedInUser) {
      var msg = {
        conversationId: req.body.conversation,
        text: req.body.text,
        created: Date.now(),
        author: loggedInUser.name  // TODO: Change to id
      }
      rdb.save('messages', msg)
        .then(function (result) {
          res.json(msg)
        })
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}

/*
 * Create new conversation
 */
module.exports.createConversation = function (req, res, next) {
  sessionService.getAuthenticatedUser(req.headers['x-api-token'])
    .then(function (loggedInUser) {
      var conversation = {
        created: Date.now(),
        creator: loggedInUser.id,
        participants: [loggedInUser.id]
      }
      rdb.save('conversations', conversation)
        .then(function (result) {
          res.json(conversation)
        })
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}
