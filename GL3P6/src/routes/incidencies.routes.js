const express = require('express');
const router = express.Router();
const Incidencia = require('../models/incidencia');
const Departamento = require('../models/departament');
const Estat = require('../models/estat');
const Tecnic = require('../models/tecnic');
const moment = require('moment-timezone');

router.post('/buscar', async (req, res) => {
  const { id } = req.body;
  if (!id || id.trim() === '') {
    return res.render('index', { error: 'Has d’introduir una ID.', incidencia: null });
  }
  try {
    const incidencia = await Incidencia.findOne({
      where: { id: id },
      include: [
        { model: Departamento, as: 'departament' },
        { model: Estat, as: 'estat' }
      ]
    });

    if (incidencia) {
      res.render('index', { incidencia, error: null });
    } else {
      res.render('index', { error: 'No s\'ha trobat la incidència.', incidencia: null });
    }
  } catch (error) {
    console.error(error);
    res.render('index', { error: 'Error al buscar la incidència.', incidencia: null });
  }
});


// Listado de incidencias
router.get('/', async (req, res) => {
  try {
    const incidencies = await Incidencia.findAll({
      include: [
        { model: Departamento, as: 'departament' },
        { model: Estat, as: 'estat' },
        { model: Tecnic, as: 'tecnic' }
      ]
    });
    res.render('incidencies/list', { incidencies });
  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    res.status(500).send('Error al obtener incidencias');
  }
});

// Mostrar formulario para crear nueva incidencia
router.get('/new', async (req, res) => {
  try {
    const departamentos = await Departamento.findAll();
    res.render('incidencies/new', { departamentos });
  } catch (error) {
    console.error('Error al cargar los departamentos:', error);
    res.status(500).send('Error al cargar los departamentos');
  }
});

// Crear nueva incidencia
router.post('/create', async (req, res) => {
  try {
    const { nom, departament_id, tipus, descripcio } = req.body;

    const dataCreacio = moment().tz('Europe/Madrid').toDate();
    const estat_id = 1; // Suponiendo que "Pendent d'assignació" es ID 1
    const dataResolucio = null;
    const tecnic_id = null;

    const incidencia = await Incidencia.create({
      nom,
      departament_id,
      tipus,
      descripcio,
      datacreacio: dataCreacio,
      estat_id,
      dataresolucio: dataResolucio,
      tecnic_id
    });

    console.log('Incidencia creada:', incidencia);
    res.redirect('/incidencies');
  } catch (error) {
    console.error('Error al crear la incidencia:', error);
    res.status(500).send("No s'ha pogut crear l'incidència: " + error);
  }
});

// Mostrar formulario para editar
router.get('/:id/edit', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id, {
      include: [
        { model: Departamento, as: 'departament' },
        { model: Estat, as: 'estat' }
      ]
    });

    if (!incidencia) {
      return res.status(404).send('Incidencia no encontrada');
    }

    const departamentos = await Departamento.findAll();
    res.render('incidencies/edit', { incidencia, departamentos });
  } catch (error) {
    console.error('Error al cargar la incidencia:', error);
    res.status(500).send('Error al cargar la incidencia para editar');
  }
});

// Actualizar incidencia
router.post('/:id/update', async (req, res) => {
  try {
    const { nom, departament_id, tipus, descripcio } = req.body;
    const incidencia = await Incidencia.findByPk(req.params.id);

    if (!incidencia) {
      return res.status(404).send('Incidencia no encontrada');
    }

    incidencia.nom = nom;
    incidencia.departament_id = departament_id;
    incidencia.tipus = tipus;
    incidencia.descripcio = descripcio;

    await incidencia.save();

    console.log('Incidencia actualizada:', incidencia);
    res.redirect('/incidencies');
  } catch (error) {
    console.error('Error al actualizar la incidencia:', error);
    res.status(500).send("No s'ha pogut actualitzar l'incidència: " + error);
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
    res.redirect('/incidencies');
  } catch (error) {
    console.error('Error al eliminar la incidencia:', error);
    res.status(500).send('Error al eliminar la incidencia: ' + error);
  }
});


module.exports = router;
