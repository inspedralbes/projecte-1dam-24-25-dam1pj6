const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const Tecnic = sequelize.define('Tecnic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cognoms: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  tableName: 'Tecnics', 
  timestamps: false,    
});

module.exports = Tecnic;
