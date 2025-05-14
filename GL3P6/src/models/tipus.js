const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tipus = sequelize.define('Tipus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'Tipus',
  timestamps: false,
});

module.exports = Tipus;
