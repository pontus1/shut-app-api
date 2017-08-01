var express = require('express')
var controller = require('../controllers/sessionController')

var router = express.Router()

router.route('/')
  .post(controller.logInUser)

module.exports = router
