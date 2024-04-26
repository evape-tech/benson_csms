'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Gun extends Model {
    static associate (models) {}
  }
  Gun.init({
    /*
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    */
    connector : DataTypes.STRING,
    cpid : DataTypes.STRING,
    cpsn : DataTypes.STRING,
    guns_status : DataTypes.STRING,
    guns_metervalue1 : DataTypes.STRING,
    guns_metervalue2 : DataTypes.STRING,
    guns_metervalue3 : DataTypes.STRING,
    guns_metervalue4 : DataTypes.STRING,
    guns_metervalue5 : DataTypes.STRING,
    guns_metervalue6 : DataTypes.STRING,
    guns_memo1 : DataTypes.STRING,
    guns_memo2 : DataTypes.STRING,
    transactionid : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Gun'
  })
  return Gun
}
