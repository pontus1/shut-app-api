var rdb = require('../lib/rethink')
var auth = require('../lib/auth')
var token = require('../lib/token')
var error = require('../service/errors')

/*
 * Login
 */
module.exports.logInUser = function (req, res, next) {
  rdb.findBy('users', 'email', req.body.email)
    .then(function (user) {
      user = user[0]

      if (!user) {
        error.notFound('User', null)
      }

      auth.authenticate(req.body.password, user.password)
        .then(function (authenticated) {
          if (authenticated) {
            var currentUser = {
              name: user.name,
              email: user.email,
              token: token.generate(user)
            }
            /* Save users id in cookie */
            req.session.user = user.id

            res.json(currentUser)
          } else {
            // TODO: create proper error
            var authenticationFailedError = new Error('Authentication failed')
            authenticationFailedError.status = 401
            return next(authenticationFailedError)
          }
        })
    })
    .catch(function (err) {
      error.errorResponse(res, err)
    })
}

// TODO: Logout (remove session/cookie)
