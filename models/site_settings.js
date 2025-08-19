'use strict';
module.exports = (sequelize, DataTypes) => {
  const SiteSettings = sequelize.define('SiteSettings', {
    ems_mode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'static'
    },
    max_power_kw: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 480
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'site_settings',
    timestamps: false
  });
  return SiteSettings;
};