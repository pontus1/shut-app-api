var express = require('express')
var auth = require('../lib/auth')
var controller = require('../controllers/chatController')
var router = express.Router()

router.route('/')
  .post(auth.authorize, controller.createMsg)

module.exports = router
