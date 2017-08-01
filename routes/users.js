var express = require('express')
var auth = require('../lib/auth')
var controller = require('../controllers/usersController')
var router = express.Router()

router.route('/')
  .get(auth.authorize, controller.getAllUsers)
  .post(controller.checkDuplicateEmail,
    controller.checkDuplicateUsername,
    controller.createNewUser)

router.route('/:id')
  .get(auth.authorize, controller.getUser)
  .put(auth.authorize, controller.updateUser)
  .delete(auth.authorize, controller.deleteUser)

module.exports = router
