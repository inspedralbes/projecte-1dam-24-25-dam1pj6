const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const Incidencia = require('./incidencia');

const Actuacio = sequelize.define('Actuacio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  descripcio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  temps_invertit: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  visible_per_usuari: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resolt: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'Actuacions', 
  timestamps: false, 
});


module.exports = Actuacio;
