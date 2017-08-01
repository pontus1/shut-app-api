var rdb = require('../lib/rethink')
var auth = require('../lib/auth')
var error = require('../service/errors')
var usersService = require('../service/users.js')

/*
 * Get all users
 */
module.exports.getAllUsers = function (req, res) {
  rdb.findAll('users')
    .then(function (users) {
      res.json(users)
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}

/*
 * Create new user
 */
module.exports.createNewUser = function (req, res, next) {
  /* Create user */
  auth.hash_password(req.body.password)
    .then(function (hash) {
      var newUser = usersService.createUser(hash, req.body.name, req.body.email)
      /* Save user */
      rdb.save('users', newUser)
        .then(function (result) {
          res.json(result)
        })
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}

/*
 * Get user by id
 */
module.exports.getUser = function (req, res, next) {
  rdb.find('users', req.params.id)
    .then(function (user) {
      if (!user) {
        error.notFound('User', req.params.id)
      }
      res.json(user)
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}

/*
 * Update user by id (TODO: authenticate user)
 */
module.exports.updateUser = function (req, res) {
  rdb.find('users', req.params.id)
    .then(function (user) {
      if (!user) {
        error.notFound('User', req.params.id)
      }
      var updateUser = {
        name: req.body.name || user.name,
        email: req.body.email || user.email
      }
      rdb.edit('users', user.id, updateUser)
        .then(function (results) {
          res.json(results)
        })
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}

/*
 * Delete user by id (TODO: authenticate user)
 */
module.exports.deleteUser = function (req, res) {
  rdb.destroy('users', req.params.id)
    .then(function (results) {
      if (results.skipped === 1) {
        error.notFound('User', req.params.id)
      }
      res.json(results)
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}

/*
 * Check if email is already in use
 */
module.exports.checkDuplicateEmail = function (req, res, next) {
  rdb.findBy('users', 'email', req.body.email)
    .then(function (result) {
      if (result.length > 0) {
        error.conflict('Email already in use')
      } else {
        next()
      }
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}

/*
 * Check if username is already in use
 */
module.exports.checkDuplicateUsername = function (req, res, next) {
  rdb.findBy('users', 'name', req.body.name)
    .then(function (result) {
      if (result.length > 0) {
        console.log(result.length)
        error.conflict('Username already in use')
      } else {
        next()
      }
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}
