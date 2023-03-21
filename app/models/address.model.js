const {DataTypes} = require("sequelize")
module.exports = (sequelize, Sequilize) => {
  const Address = sequelize.define("address", {
    street: {
      type: DataTypes.STRING
    },
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING
  })

  return Address
}
