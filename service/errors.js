var httpErrors = require('httperrors')

// TODO: move this file to a different location (it shouldn't be in controllers)

/*
 * 400 Bad Request
 */
module.exports.badRequest = function () {
 throw new httpErrors.BadRequest('The request was invalid or cannot be served')
}

/*
 * 401 Unauthorized
 */
module.exports.unauthorized = function (cause) {
  throw new httpErrors.Unauthorized('Unauthorized: ' + cause)
}

/*
 * 404 Not Found
 */
module.exports.notFound = function (type, id) {
  throw new httpErrors.NotFound(type + ' with id "' + id + '" does not exist.')
}

/*
 * 409 Conflict
 */
module.exports.conflict = function (cause) {
  throw new httpErrors.Conflict('Conflict: ' + cause)
}

module.exports.errorResponse = function (res, err) {
  if (err instanceof httpErrors === false) {
    /* 500 Internal Server Error (all unspecified errors) */
    err = new httpErrors.InternalServerError(err.message)
  }
  res.status(err.status)
  res.json({
    error: err.name,
    status: err.status,
    message: err.message
  })
}
