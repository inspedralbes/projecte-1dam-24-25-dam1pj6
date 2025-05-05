const express = require('express');
const router = express.Router();
const Incidencia = require('../models/incidencia'); 
const Departamento = require('../models/departament'); 
const Estat = require('../models/estat'); 
const Tecnic = require('../models/tecnic');

// Mostrar listado de incidencias
router.get('/', async (req, res) => {
  try {
    const incidencies = await Incidencia.findAll({
      include: [
        { model: Departamento, as: 'departament' },
        { model: Estat, as: 'estat' },
        { model: Tecnic, as: 'tecnic' }  
      ]
    });

    res.render('admin/index', { incidencies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al carregar les incidències');
  }
});

// Mostrar formulario para editar
router.get('/:id/edit', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) {
      return res.status(404).send('Incidencia no encontrada');
    }

    const departamentos = await Departamento.findAll();
    const estats = await Estat.findAll();
    const tecnics = await Tecnic.findAll();  

    res.render('admin/edit', {
      incidencia,
      departamentos,
      estats,
      tecnics   
    });
  } catch (error) {
    console.error('Error al cargar la incidencia:', error);
    res.status(500).send('Error al cargar la incidencia');
  }
});

// Actualizar incidencia
router.post('/:id/update', async (req, res) => {
  try {
    const {
      nom,
      departament_id,
      tipus,
      descripcio,
      datacreacio,
      estat_id,
      dataresolucio,
      tecnic_id     
    } = req.body;

    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) {
      return res.status(404).send('Incidencia no encontrada');
    }

    incidencia.nom = nom;
    incidencia.departament_id = departament_id;
    incidencia.tipus = tipus;
    incidencia.descripcio = descripcio;
    incidencia.datacreacio = datacreacio;
    incidencia.estat_id = estat_id;
    incidencia.dataresolucio = dataresolucio ? dataresolucio : null;
    incidencia.tecnic_id = tecnic_id || null;  

    await incidencia.save();

    console.log('Incidencia actualizada:', incidencia);
    return res.redirect('/admin');  
  } catch (error) {
    console.error('Error al actualizar la incidencia:', error);
    if (!res.headersSent) {
      return res.status(500).send('Error al actualizar la incidencia: ' + error);
    }
  }
});

// Eliminar incidencia
router.get('/:id/delete', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) {
      return res.status(404).send('Incidencia no encontrada');
    }
    await incidencia.destroy();
    console.log('Incidencia eliminada:', incidencia);
    return res.redirect('/admin');
  } catch (error) {
    console.error('Error al eliminar la incidencia:', error);
    if (!res.headersSent) {
      return res.status(500).send('Error al eliminar la incidencia');
    }
  }
});

module.exports = router;
