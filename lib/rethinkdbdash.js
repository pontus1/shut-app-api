var config = require('../config/database')

var rdb = require('rethinkdbdash')({
  host: config.host || 'localhost',
  port: config.port || '28015',
  db: config.db || 'shut-app',
  pool: true,
  cursor: true
})

module.exports = rdb
