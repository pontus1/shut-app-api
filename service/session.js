var rdb = require('../lib/rethink')
var token = require('../lib/token')

/*
 * Get logged in user
 */
module.exports.getAuthenticatedUser = function (data) {
  var decodedToken = token.decode(data)     // console.log('decoded token = ', decodedToken)
  return rdb.find('users', decodedToken.sub)
    .then(function (authenticatedUser) {
      return authenticatedUser
    })
    .catch(function (err) {
      console.log(err)
    })
}
