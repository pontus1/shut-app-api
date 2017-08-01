var bcrypt = require('bcrypt')
var token = require('./token')
var Promise = require('bluebird')

/*
 * Check token
 */
module.exports.authorize = function (req, res, next) {
  var apiToken = req.headers['x-api-token']
  token.verify(apiToken, next)
  next()
}

/*
 * Decrypt password
 */
module.exports.authenticate = function (password, hash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hash, function (error, res) {
      if (error) return reject(error)
      return resolve(res)
    })
  })
}

/*
 * Encrypt password
 */
module.exports.hash_password = function (password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (error, salt) {
      if (error) return reject(error)

      bcrypt.hash(password, salt, function (error, hash) {
        if (error) return reject(error)
        return resolve(hash)
      })
    })
  })
}
