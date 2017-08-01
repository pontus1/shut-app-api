require('babel-core/register')

const r = require('rethinkdb')
const config = require('./database')

const DATABASE = config.db || 'shut_app'
const TABLES = ['users', 'messages', 'sessions']
let connection = null

/*
 * connect to RethinkDB server
 * create database
 * create tables
 * insert dummy data
 * close connection
 */
connect()
  .then(() => createDbIfNotExists())
  .then(() => Promise.all(TABLES.map((table) => createTableIfNotExists(table))))
  .then(() => Promise.all(TABLES.map((table) => insertDummyDataIfNotExists(table))))
  .then(() => closeConnection())

/*
 * Create a connection to the database server
 */
function connect () {
  return (
    r.connect(config.db, function (err, conn) {
      if (err) throw err
      connection = conn
      console.log(' [*] Connected to RethinkDB')
      return Promise.resolve(true)
    })
  )
}

/*
 * Close connection to database server
 */
function closeConnection () {
  connection.close()
  console.log(' [*] Connection closed')
}

/*
 * Create the database if it doesn't exist
 */
function createDbIfNotExists () {
  return getDbList()
    .then((list) => {
      if (list.indexOf(DATABASE) === -1) {
        return createDatabase()
      } else {
        console.log(' [!] Database already exists:', DATABASE)
        return Promise.resolve(true)
      }
    })
}

/*
 * Create table if it doesn't exist in Database
 */
function createTableIfNotExists (table) {
  return getTableList()
    .then((list) => {
      if (list.indexOf(table) === -1) {
        return createTable(table)
      } else {
        console.log(' [!] Table already exists:', table)
        return Promise.resolve(true)
      }
    })
}

/*
 * Insert dummy data to the a specific table if it's currently empty
 */
function insertDummyDataIfNotExists (table) {
  return getTableLength(table)
    .then((list) => {
      if (list === 0) {
        return insertDummyData(table)
      } else {
        console.log(' [!] Dummy-data already exists for:', table)
        return Promise.resolve(true)
      }
    })
}

/*
 * Get a list of all databases in the system
 */
function getDbList () {
  return r.dbList().run(connection)
}

/*
 * Get a list of all tables in database
 */
function getTableList () {
  return r.db(DATABASE).tableList().run(connection)
}

/*
 * Get the current number of elements in a table
 */
function getTableLength (table) {
  return r.db(DATABASE).table(table).count().run(connection)
}

/*
 * Create database
 */
function createDatabase () {
    console.log(' [-] Create Database:', DATABASE)
    return r.dbCreate(DATABASE).run(connection)
}

/*
 * Create table in Database
 */
function createTable (table) {
  console.log(' [-] Create Table: ', table)
  return r.db(DATABASE).tableCreate(table).run(connection)
}

/*
 * Insert dummy data from the dummy-data JSON-files
 */
function insertDummyData (table) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(' [-] Create Dummy Data for: ' + table)
    let jsonTableData = require('./dummy-data/' + table + '.json')
    return r.db(DATABASE).table(table).insert(jsonTableData).run(connection)
  }
}
