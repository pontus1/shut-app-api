var jwt = require('jwt-simple')
var moment = require('moment')
var secret = process.env.TOKEN_SECRET
var error = require('../service/errors')

/*
 * Generate new token (valid for a week)
 */
module.exports.generate = function (user) {
  var expires = moment().add(7, 'days').valueOf()
  return jwt.encode({
    sub: user.id,
    iss: user.email,
    exp: expires,
    name: user.name,
    admin: user.isAdmin }, secret)
}

/*
 * Verify token
 */
module.exports.verify = function (token, next) {
  /* No token found */
  if (!token) {
    error.unauthorized('Token not found')
    return next()
  }
  /* Token has expired */
  if (jwt.decode(token, secret).exp <= moment().format('x')) {
    error.unauthorized('Token has expired')
    return next()
  }
}

/*
 * Decode token
 */
module.exports.decode = function (token) {
  try {
    return jwt.decode(token, secret)
  } catch (err) {
    error.unauthorized()
  }
}

// var expiredError = new Error('Token has expired')
// expiredError.status = 401
// return next(expiredError)
