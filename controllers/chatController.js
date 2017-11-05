var rdb = require('../lib/rethink')
// var auth = require('../lib/auth')
var error = require('../service/errors')

var sessionService = require('../service/session')

/*
 * Post chat message
 */
module.exports.createMsg = function (req, res, next) {
  sessionService.getAuthenticatedUser(req.headers['x-api-token'])
    .then(function (loggedInUser) {
      var msg = {
        conversationId: req.params.conversationId,
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

/*
 * Get all messages
 */
module.exports.getAllMessages = function (req, res, next) {
  // TODO: Make sure user is authorized to se all (admin)
  rdb.findAll('messages')
    .then(function (messages) {
      res.json(messages)
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}

/*
 * Get all messages from conversation
 */
module.exports.getConversationMessages = function (req, res, next) {
  // TODO: Make sure user is authorized to se conversation (participant of conversation or admin)
  rdb.findBy('messages', 'conversationId', req.params.id)
  .then(function (messages) {
    res.json(messages)
  })
  .catch(function (err) {
    error.errorResponse(res, err)
  })
}
