var rdb = require('./rethinkdbdash')

/*
 * Find by id
 */
module.exports.find = function (tableName, id) {
  return rdb.table(tableName).get(id).run()
  .then(function (result) {
    return result
  })
}

/*
 * Find all
 */
module.exports.findAll = function (tableName) {
  return rdb.table(tableName).run()
  .then(function (cursor) {
    return cursor.toArray()  // TODO: Remove toArray from all queriesusers (see rethinkdbdash docs)
  })
}

/*
 * find by field name
 */
module.exports.findBy = function (tableName, fieldName, value) {
  return rdb.table(tableName).filter(rdb.row(fieldName).eq(value)).run()
  .then(function (cursor) {
    return cursor.toArray()
  })
}

/*
 *
 */
module.exports.findIndexed = function (tableName, query, index) {
  return rdb.table(tableName).getAll(query, { index: index }).run()
  .then(function (cursor) {
    return cursor.toArray()
  })
}

/*
 * Save to database
 */
module.exports.save = function (tableName, object) {
  return rdb.table(tableName).insert(object).run()
  .then(function (result) {
    return result
  })
}

/*
 * Update by id
 */
module.exports.edit = function (tableName, id, object) {
  return rdb.table(tableName).get(id).update(object).run()
  .then(function (result) {
    return result
  })
}

/*
 * Delete by id
 */
module.exports.destroy = function (tableName, id) {
  return rdb.table(tableName).get(id).delete().run()
  .then(function (result) {
    return result
  })
}

/*
 * Push message updates
 */
module.exports.liveMessageUpdates = function (io) {
  rdb.table('messages').changes().run()
    .then(function (result) {
      result.each(function (error, row) {
        if (error) throw error
        // if (row.new_val === null) { /* message deleted */ }
        // if (row.old_val !== null) { /* message updated */ }
        io.emit('new-message', row.new_val)
      })
    })
}
