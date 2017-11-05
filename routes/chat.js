var express = require('express')
var auth = require('../lib/auth')
var controller = require('../controllers/chatController')
var router = express.Router()

router.route('/conversations/:conversationId/message')
  .post(auth.authorize, controller.createMsg)

router.route('/conversations')
  .get(auth.authorize, controller.getConversationsByLoggedInUser)
  .post(auth.authorize, controller.createConversation)

router.route('/conversations/:id')
  .get(auth.authorize, controller.getConversationMessages)


module.exports = router
