// src/models/incidencia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Departament = require('./departament');
const Estat = require('./estat');  
const Tecnic = require('./tecnic');
const Actuacio = require('./actuacio'); 

const Incidencia = sequelize.define('Incidencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departament_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Departament,
      key: 'id',
    },
  },
  tipus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  datacreacio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, 
  },
  estat_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Estat, 
      key: 'id'
    },
    allowNull: true,
  },
  tecnic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Tecnic, 
      key: 'id'
    },
    allowNull: true,
  },
  dataresolucio: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false,
});

Incidencia.belongsTo(Estat, {
  foreignKey: 'estat_id',
  as: 'estat',
});
Incidencia.belongsTo(Departament, {
  foreignKey: 'departament_id',
  as: 'departament',
});
Incidencia.belongsTo(Tecnic, { 
  foreignKey: 'tecnic_id', 
  as: 'tecnic' });
Incidencia.hasMany(Actuacio, {
  foreignKey: 'incidencia_id',
  as: 'actuacions'
});
Actuacio.belongsTo(Incidencia, {
  foreignKey: 'incidencia_id',
  as: 'incidencia'
});


module.exports = Incidencia;
