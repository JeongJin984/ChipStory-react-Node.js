const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "nodebird-react",
    host: "localhost",
    dialect: 'mysql',
    port: 3306
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "nodebird-react",
    host: "localhost",
    dialect: 'mysql',
    port: 3306
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "nodebird-react",
    host: "localhost",
    dialect: 'mysql',
    port: 3306
  },
}
