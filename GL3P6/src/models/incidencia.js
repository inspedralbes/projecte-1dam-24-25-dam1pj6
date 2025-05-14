
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Departament = require('./departament');
const Estat = require('./estat');
const Tecnic = require('./tecnic');
const Actuacio = require('./actuacio');
const Prioritat = require('./prioritat');
const Tipus = require('./tipus');  

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
  tipus_id: {                         
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tipus,
      key: 'id',
    },
  },
  descripcio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  datacreacio: {
    type: DataTypes.DATEONLY,
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
  prioritat_id: {                    
    type: DataTypes.INTEGER,
    references: {
      model: Prioritat,
      key: 'id'
    },
    allowNull: true,
  },
  dataresolucio: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'Incidencia',
  timestamps: false,
});

// Associations
Incidencia.belongsTo(Departament, {
  foreignKey: 'departament_id',
  as: 'departament',
});
Incidencia.belongsTo(Tipus, {
  foreignKey: 'tipus_id',
  as: 'tipus',
});
Incidencia.belongsTo(Estat, {
  foreignKey: 'estat_id',
  as: 'estat',
});
Incidencia.belongsTo(Tecnic, {
  foreignKey: 'tecnic_id',
  as: 'tecnic'
});
Incidencia.belongsTo(Prioritat, {
  foreignKey: 'prioritat_id',
  as: 'prioritat'
});
Incidencia.hasMany(Actuacio, {
  foreignKey: 'incidencia_id',
  as: 'actuacions'
});
Actuacio.belongsTo(Incidencia, {
  foreignKey: 'incidencia_id',
  as: 'incidencia'
});

module.exports = Incidencia;
