const dbConfig = require("../config/db.config")
const Sequelize = require("sequelize")

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
)

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

const User = require("./users.model")(sequelize, Sequelize)
const Address = require("./address.model")(sequelize, Sequelize)

User.hasOne(Address)
Address.belongsTo(User)

db.User = User
db.Address = Address


module.exports = db
