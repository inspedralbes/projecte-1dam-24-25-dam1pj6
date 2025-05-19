const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Tecnic = require('../models/tecnic');
const Incidencia = require('../models/incidencia');
const Departamento = require('../models/departament');
const Estat = require('../models/estat');
const Actuacio = require('../models/actuacio');
const Prioritat = require('../models/prioritat');
const Tipus = require('../models/tipus');
const moment = require('moment');

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

// Mostrar incidencias asignadas al técnico seleccionado (excluyendo resoltes)
router.get('/incidencies', async (req, res) => {
  try {
    const tecnicId = req.query.tecnic_id;
    const sortField = req.query.sort || 'datacreacio';
    const sortOrder = req.query.order === 'DESC' ? 'DESC' : 'ASC';
    const prioritatId = req.query.prioritat_id;

    const tecnic = await Tecnic.findByPk(tecnicId);
    if (!tecnic) return res.status(404).send('Tècnic no trobat');

    const estatResolta = await Estat.findOne({ where: { nom: 'Resolta' } });

    // Construir condicions dinàmiques
    const whereConditions = {
      tecnic_id: tecnicId,
      estat_id: { [Op.ne]: estatResolta.id }
    };

    if (prioritatId) {
      whereConditions.prioritat_id = prioritatId;
    }

    const incidencies = await Incidencia.findAll({
      where: whereConditions,
      include: [
        { model: Estat, as: 'estat' },
        { model: Actuacio, as: 'actuacions' },
        { model: Prioritat, as: 'prioritat' }
      ],
      order: [[sortField, sortOrder]]
    });

    const prioritats = await Prioritat.findAll(); 

    const success = req.query.success;

    res.render('tecnic/list', {
      incidencies,
      tecnic,
      sortField,
      sortOrder,
      success,
      prioritats,
      prioritatSeleccionada: prioritatId 
    });
  } catch (error) {
    console.error('Error al carregar incidències:', error);
    res.status(500).send('Error al carregar incidències');
  }
});


// Mostrar incidències no assignades
router.get('/incidencies/noassignades', async (req, res) => {
  try {
    const tecnicId = req.query.tecnic_id;
    if (!tecnicId) return res.status(400).send('Tècnic no especificat');

    const tecnic = await Tecnic.findByPk(tecnicId);
    if (!tecnic) return res.status(404).send('Tècnic no trobat');

    const estatPendent = 1; // o buscar dinámicamente el id si prefieres

    const incidencies = await Incidencia.findAll({
      where: {
        estat_id: estatPendent,
      }
    });

    res.render('tecnic/noassignades', { tecnic, incidencies });
  } catch (error) {
    console.error('Error al cargar incidències no assignades:', error);
    res.status(500).send('Error al cargar les incidències no assignades');
  }
});



// Assignar incidències seleccionades al tècnic
router.post('/incidencies/assignar', async (req, res) => {
  try {
    const { tecnic_id, incidencies_ids } = req.body;
    if (!tecnic_id || !incidencies_ids) return res.status(400).send('Falten dades del formulari');

    const ids = Array.isArray(incidencies_ids) ? incidencies_ids : [incidencies_ids];
    const estatEnProces = await Estat.findOne({ where: { nom: 'Assignada' } });

    await Promise.all(ids.map(id =>
      Incidencia.update(
        { tecnic_id: tecnic_id, estat_id: estatEnProces.id },
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
        { model: Estat, as: 'estat' },
        { model: Actuacio, as: 'actuacions' },
        { model: Prioritat, as: 'prioritat' },
        { model: Tipus, as: 'tipus' }
      ]
    });

    if (!incidencia) return res.status(404).send('Incidència no trobada');

    const estat = await Estat.findAll();
    const departamentos = await Departamento.findAll();
    const prioritats = await Prioritat.findAll();
    const tipus = await Tipus.findAll();
    const tecnics = await Tecnic.findAll(); 

    incidencia.dataresolucio = incidencia.dataresolucio
      ? moment(incidencia.dataresolucio).format('YYYY-MM-DD')
      : '';

    res.render('incidencies/edit', { incidencia, departamentos, prioritats, estats: estat, tipus, tecnics, tecnic: await Tecnic.findByPk(incidencia.tecnic_id)}); 
  } catch (error) {
    console.error('Error al cargar la incidencia:', error);
    res.status(500).send('Error al cargar la incidencia ' + error);
  }
});

// Actualizar incidencia
router.post('/incidencies/:id/update', async (req, res) => {
  try {
    const { estat_id, dataresolucio, acceptat, prioritat_id, tipus_id, tecnic_id } = req.body;
    const estatResolta = await Estat.findOne({ where: { nom: 'Resolta' } });
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada');

    if (dataresolucio) {
      incidencia.dataresolucio = dataresolucio;
      incidencia.estat_id = estatResolta ? estatResolta.id : estat_id;
    } else {
      incidencia.estat_id = estat_id;
      incidencia.dataresolucio = null;
    }

    incidencia.acceptat = acceptat === 'on';
    incidencia.prioritat_id = prioritat_id || null;
    incidencia.tipus_id = tipus_id || null;  
    incidencia.tecnic_id = tecnic_id || null;  // Assegura't de passar el tecnic_id si s'actualitza

    await incidencia.save();
    res.redirect(`/tecnic/incidencies?tecnic_id=${incidencia.tecnic_id}`);
  } catch (error) {
    console.error('Error al actualizar la incidencia:', error);
    res.status(500).send('Error al actualizar la incidencia');
  }
});

// Llista d'incidències resoltes d'un tècnic
router.get('/incidencies/resoltes', async (req, res, next) => {
  try {
    const estatResolta = await Estat.findOne({ where: { nom: 'Resolta' } });
    if (!estatResolta) throw new Error('No existeix l’estat "Resolta"');

    const resoltes = await Incidencia.findAll({
      where: { estat_id: estatResolta.id },
      include: [
        { model: Departamento, as: 'departament' },
        { model: Prioritat, as: 'prioritat' }
      ],
      order: [['dataresolucio', 'DESC']]
    });

    res.render('tecnic/resoltes_all', { resoltes });
  } catch (err) {
    next(err);
  }
});

// Eliminar incidència
router.post('/incidencies/:id/delete', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada');

    await incidencia.destroy();
    res.redirect('/tecnic/incidencies/resoltes');  
  } catch (error) {
    console.error('Error al eliminar la incidència:', error);
    res.status(500).send('Error al eliminar la incidència');
  }
});
// ACTUACIONS

// Mostrar actuacions de una incidència
router.get('/incidencies/:id/actuacions', async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    const incidencia = await Incidencia.findByPk(incidenciaId, {
      include: [{ model: Actuacio, as: 'actuacions' }]
    });

    if (!incidencia) return res.status(404).send('Incidència no trobada ');

    const tecnic = await Tecnic.findByPk(incidencia.tecnic_id);

    res.render('actuacions/list', { actuacions: incidencia.actuacions, incidencia, tecnic });
  } catch (error) {
    console.error('Error al cargar les actuacions:', error);
    res.status(500).send('Error al cargar les actuacions ' + error);
  }
});


// Mostrar formulario para afegir una nova actuació
router.get('/incidencies/:id/actuacions/new', async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    const incidencia = await Incidencia.findByPk(incidenciaId);
    if (!incidencia) return res.status(404).send('Incidència no trobada');

    res.render('actuacions/new', { incidencia });
  } catch (error) {
    console.error('Error al mostrar el formulario de actuació:', error);
    res.status(500).send('Error al mostrar el formulario de actuació');
  }
});

// Crear una nueva actuació
router.post('/incidencies/:id/actuacions/create', async (req, res) => {
  try {
    const { descripcio, temps_invertit, visible_per_usuari, resolt } = req.body;
    const incidenciaId = req.params.id;

    const incidencia = await Incidencia.findByPk(incidenciaId);

    if (!incidencia) {
      return res.status(404).send('Incidència no trobada');
    }

    const actuacio = await Actuacio.create({
      data: new Date(),
      descripcio,
      temps_invertit,
      visible_per_usuari: visible_per_usuari === 'true',
      resolt: resolt === 'true',
      incidencia_id: incidenciaId,
    });

    console.log('Actuació creada:', actuacio);
    res.redirect(`/tecnic/incidencies?tecnic_id=${incidencia.tecnic_id}&success=1`);
  } catch (error) {
    console.error('Error al crear la actuació:', error);
    res.status(500).send('Error al crear la actuació');
  }
});

// Eliminar actuació
router.get('/incidencies/:incidenciaId/actuacions/:actuacioId/delete', async (req, res) => {
  try {
    const { incidenciaId, actuacioId } = req.params;

    // Verificamos que la actuació existe y pertenece a la incidencia
    const actuacio = await Actuacio.findOne({ 
      where: { id: actuacioId, incidencia_id: incidenciaId }
    });

    if (!actuacio) {
      return res.status(404).send('Actuació no trobada o no pertany a la incidència indicada');
    }

    await actuacio.destroy();

    // Redirigimos a la lista de actuaciones de esa incidencia
    res.redirect(`/tecnic/incidencies/${incidenciaId}/actuacions`);
  } catch (error) {
    console.error('Error al eliminar l\'actuació:', error);
    res.status(500).send('Error al eliminar l\'actuació');
  }
});


module.exports = router;
