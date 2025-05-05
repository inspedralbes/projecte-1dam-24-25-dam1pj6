const express = require('express');
const router = express.Router();
const Tecnic = require('../models/tecnic');
const Incidencia = require('../models/incidencia');
const Estat = require('../models/estat');


// Mostrar página principal para seleccionar técnico
router.get('/', async (req, res) => {
  try {
    const tecnics = await Tecnic.findAll();
    res.render('tecnic/select', { tecnics });
  } catch (error) {
    console.error('Error al cargar los técnicos:', error);
    res.status(500).send('Error al cargar los técnicos');
  }
});

// Mostrar incidencias asignadas al técnico seleccionado
router.get('/incidencies', async (req, res) => {
  try {
    const tecnicId = req.query.tecnic_id;

    // Verifica si el tecnico existe
    const tecnic = await Tecnic.findByPk(tecnicId);
    if (!tecnic) {
      return res.status(404).send('Técnico no encontrado');
    }

    // Obtener incidencias asignadas a este técnico
    const incidencies = await Incidencia.findAll({
      where: { tecnic_id: tecnicId },
      include: [
        { model: Estat, as: 'estat' }
      ]
    });

    res.render('tecnic/list', { incidencies, tecnic });
  } catch (error) {
    console.error('Error al cargar las incidencias:', error);
    res.status(500).send('Error al cargar las incidencias');
  }
});
// Actualizar incidencia
router.post('/incidencies/:id/update', async (req, res) => {
  try {
    const { estat_id, dataresolucio, acceptat } = req.body;

    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) {
      return res.status(404).send('Incidencia no encontrada');
    }

    incidencia.estat_id = estat_id;
    incidencia.dataresolucio = dataresolucio || null;
    incidencia.acceptat = acceptat === 'true';

    await incidencia.save();

    console.log('Incidencia actualizada:', incidencia);
    res.redirect(`/tecnic/incidencies`);
  } catch (error) {
    console.error('Error al actualizar la incidencia:', error);
    res.status(500).send('Error al actualizar la incidencia');
  }
});

module.exports = router;
