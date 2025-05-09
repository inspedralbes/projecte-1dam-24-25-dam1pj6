const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const Prioritat = sequelize.define('Prioritat', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    autoIncrement: true 
  },
  

  nom: {
    type: DataTypes.STRING,
    allowNull: false,  
    unique: true  
  },
}, 
{
  
  timestamps: false
});

module.exports = Prioritat;
