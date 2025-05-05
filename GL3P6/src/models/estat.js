const { DataTypes } = require('sequelize');
const sequelize = require('../db');  // Asegúrate de que este es el archivo donde se inicializa tu instancia de sequelize

const Estat = sequelize.define('Estat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Pendent d\'assignar',  // El valor por defecto que mencionas
    unique: true,
  },
}, {
  tableName: 'Estat',  // Aquí es donde especificamos el nombre de la tabla exacto
  timestamps: false,  // Si no usas createdAt/updatedAt
});

module.exports = Estat;


