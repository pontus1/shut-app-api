var express = require('express')
var auth = require('../lib/auth')
var controller = require('../controllers/chatController')
var router = express.Router()

router.route('/message')
  .post(auth.authorize, controller.createMsg)

router.route('/conversation')
  .post(auth.authorize, controller.createConversation)

module.exports = router
