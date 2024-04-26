'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cp_log extends Model {
    static associate (models) {}
  }
  Cp_log.init({
    /*
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    */
    cpid : DataTypes.STRING,
    cpsn : DataTypes.STRING,
    log : DataTypes.TEXT,
      time : DataTypes.DATE,
    inout : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cp_log'
  })
  return Cp_log
}
