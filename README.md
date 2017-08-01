# shut-app-api
* API for a chat application

## Getting Started
* Clone the repo and
```
npm i
```

* Create a .env file
```
touch .env
```

```
DB_HOST=<hostname>
DB_PORT=28015
DB_NAME=<database name>
TOKEN_SECRET=<secret>
SERVER_HOST=<server host>
SERVER_PORT=<port>
```

## Setup database
```
npm run db-setup
```
This will create a database with all tables and fill them with dummy data.

## Run 

#### Start database server
```
rethinkdb
```
#### Start server
```
npm run start:dev
```

