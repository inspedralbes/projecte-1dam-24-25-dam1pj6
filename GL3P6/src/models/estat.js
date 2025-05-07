const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Estat = sequelize.define('Estat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Pendent d\'assignar',  
    unique: true,
  },
}, {
  tableName: 'Estat',  
  timestamps: false,  
});

module.exports = Estat;


