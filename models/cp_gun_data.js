'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cp_gun_data extends Model {
    static associate (models) {}
  }
  Cp_gun_data.init({
    /*
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    */
    gunid : DataTypes.STRING,
    cpsn : DataTypes.STRING,
    connector_num : DataTypes.STRING,
    connector : DataTypes.STRING,
    last_heartbeat : DataTypes.DATE,
    online : DataTypes.STRING,
    brand : DataTypes.STRING,
    loc : DataTypes.STRING,
    station_name : DataTypes.STRING,
    local_cp_num : DataTypes.STRING,
    current_status : DataTypes.STRING,
    charging_current_a : DataTypes.STRING,
    charging_voltage : DataTypes.STRING,
    charging_start_time : DataTypes.DATE,
    charging_end_time : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Cp_gun_data'
  })
  return Cp_gun_data
}
