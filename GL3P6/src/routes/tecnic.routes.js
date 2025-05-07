const express = require('express');
const router = express.Router();
const Tecnic = require('../models/tecnic');
const Incidencia = require('../models/incidencia');
const Estat = require('../models/estat');
const Actuacio = require('../models/actuacio');


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
        { model: Estat, as: 'estat' },
        { model: Actuacio, as: 'actuacions' }
      ]
    });

    res.render('tecnic/list', { incidencies, tecnic });
  } catch (error) {
    console.error('Error al cargar las incidencias:', error);
    res.status(500).send('Error al cargar las incidencias');
  }
});

// Mostrar incidències no assignades
router.get('/incidencies/noassignades', async (req, res) => {
  try {
    const tecnicId = req.query.tecnic_id;
    const tecnic = await Tecnic.findByPk(tecnicId);
    if (!tecnic) {
      return res.status(404).send('Tècnic no trobat');
    }

    const incidencies = await Incidencia.findAll({
      where: { tecnic_id: null }
    });

    res.render('tecnic/noassignades', { tecnic, incidencies });
  } catch (error) {
    console.error('Error al carregar incidències no assignades:', error);
    res.status(500).send('Error al carregar les incidències no assignades');
  }
});
// Assignar incidències seleccionades al tècnic
router.post('/incidencies/assignar', async (req, res) => {
  try {
    const { tecnic_id, incidencies_ids } = req.body;

    if (!tecnic_id || !incidencies_ids) {
      return res.status(400).send('Falten dades del formulari');
    }
    const ids = Array.isArray(incidencies_ids) ? incidencies_ids : [incidencies_ids];

    await Promise.all(ids.map(id =>
      Incidencia.update(
        { tecnic_id: tecnic_id },
        { where: { id } }
      )
    ));

    res.redirect(`/tecnic/incidencies?tecnic_id=${tecnic_id}`);
  } catch (error) {
    console.error('Error assignant incidències:', error);
    res.status(500).send('Error assignant incidències');
  }
});

// Mostrar el formulario de edición de una incidencia
router.get('/incidencies/:id/edit', async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    const incidencia = await Incidencia.findByPk(incidenciaId, {
      include: [
        { model: Estat, as: 'estat' }
      ]
    });

    if (!incidencia) {
      return res.status(404).send('Incidència no trobada');
    }

    // Si es necesario cargar departamentos, importarlos previamente
    const Departament = require('../models/departament');  // Asegúrate de que este modelo existe
    const departamentos = await Departament.findAll();

    res.render('incidencies/edit', { incidencia, departamentos });
  } catch (error) {
    console.error('Error al cargar la incidencia:', error);
    res.status(500).send('Error al cargar la incidencia');
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
    incidencia.acceptat = acceptat === 'on';  // checkbox enviado como 'on' cuando está marcado

    await incidencia.save();

    console.log('Incidencia actualizada:', incidencia);
    res.redirect(`/tecnic/incidencies?tecnic_id=${incidencia.tecnic_id}`);  // Redirige a la lista de incidencias
  } catch (error) {
    console.error('Error al actualizar la incidencia:', error);
    res.status(500).send('Error al actualizar la incidencia');
  }
});


// Mostrar actuacions de una incidència
router.get('/incidencies/:id/actuacions', async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    const incidencia = await Incidencia.findByPk(incidenciaId, {
      include: [
        { model: Actuacio, as: 'actuacions' }
      ]
    });

    if (!incidencia) {
      return res.status(404).send('Incidència no trobada');
    }

    res.render('actuacions/list', { actuacions: incidencia.actuacions, incidencia });
  } catch (error) {
    console.error('Error al cargar les actuacions:', error);
    res.status(500).send('Error al carregar les actuacions');
  }
});
// Mostrar formulari para afegir una nova actuació
router.get('/incidencies/:id/actuacions/new', async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    const incidencia = await Incidencia.findByPk(incidenciaId);
    if (!incidencia) {
      return res.status(404).send('Incidència no trobada');
    }

    res.render('actuacions/new', { incidencia });
  } catch (error) {
    console.error('Error al mostrar el formulario de actuació:', error);
    res.status(500).send('Error al mostrar el formulario de actuació');
  }
});

// Crear una nueva actuació
router.post('/incidencies/:id/actuacions/create', async (req, res) => {
  try {
    const { descripcio, temps_invertit, visible, resolta } = req.body;
    const incidenciaId = req.params.id;

    const actuacio = await Actuacio.create({
      data: new Date(),
      descripcio,
      temps_invertit,
      visible,
      resolta,
      incidencia_id: incidenciaId,
    });

    console.log('Actuació creada:', actuacio);
    res.redirect(`/tecnic/incidencies/${incidenciaId}/actuacions`);
  } catch (error) {
    console.error('Error al crear la actuació:', error);
    res.status(500).send('Error al crear la actuació' + error);
  }
});


module.exports = router;
