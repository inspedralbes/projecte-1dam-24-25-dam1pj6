  const express = require('express');
  const router = express.Router();
  const Incidencia = require('../models/incidencia');
  const Departamento = require('../models/departament');
  const Estat = require('../models/estat');
  const Tecnic = require('../models/tecnic');
  const moment = require('moment-timezone');
  const Actuacio = require('../models/actuacio');
  const Prioritat = require('../models/prioritat');
  const Tipus = require('../models/tipus');

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
          { model: Estat, as: 'estat' },
          { model: Actuacio, as: 'actuacions' },
          { model: Tipus, as: 'tipus' }   
        ]
      });

      if (incidencia) {
        incidencia.actuacions = incidencia.actuacions.filter(
          a => a.visible_per_usuari === true || a.visible_per_usuari === 1 || a.visible_per_usuari === 'true'
        );

        return res.render('index', { incidencia, error: null });
      } else {
        return res.render('index', { error: 'No s\'ha trobat la incidència.', incidencia: null });
      }
    } catch (error) {
      console.error(error);
      return res.render('index', { error: 'Error al buscar la incidència.', incidencia: null });
    }
  });


  // Listado de incidencias
  router.get('/', async (req, res) => {
    try {
      const sortField = req.query.sort || 'id';
      const sortOrder = req.query.order === 'DESC' ? 'DESC' : 'ASC';

      const incidencies = await Incidencia.findAll({
        include: [
          { model: Departamento, as: 'departament' },
          { model: Estat, as: 'estat' },
          { model: Tecnic, as: 'tecnic' },
          { model: Prioritat, as: 'prioritat' },
          { model: Tipus, as: 'tipus' }   
        ],
        order: [[sortField, sortOrder]]
      });

      res.render('incidencies/list', {
        incidencies,
        sortField,
        sortOrder
      });
    } catch (error) {
      console.error('Error al obtener incidencias:', error);
      res.status(500).send('Error al obtener incidencias');
    }
  });

  // Mostrar formulario para crear nueva incidencia
  router.get('/new', async (req, res) => {
    try {
      const departamentos = await Departamento.findAll();
      const tipus = await Tipus.findAll(); 
      res.render('incidencies/new', {
        departamentos,
        tipus,  
        successMessage: false    
      });
    } catch (error) {
      console.error('Error al cargar los departamentos:', error);
      res.status(500).send('Error al cargar los departamentos');
    }
  });

  // Crear nueva incidencia
  router.post('/create', async (req, res) => {
    try {
      const { nom, departament_id, tipus_id, descripcio } = req.body; 

      const dataCreacio = moment().tz('Europe/Madrid').toDate();
      const estat_id = 1; 
      const dataResolucio = null;
      const tecnic_id = null;

      const incidencia = await Incidencia.create({
        nom,
        departament_id,
        tipus_id,   
        descripcio,
        datacreacio: dataCreacio,
        estat_id,
        dataresolucio: dataResolucio,
        tecnic_id
      });

      console.log('Incidencia creada:', incidencia);
      const departamentos = await Departamento.findAll();
      const tipus = await Tipus.findAll();  
      res.render('incidencies/new', {
        successMessage: 'Incidència creada correctament!',
        departamentos,
        tipus   
      });
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

    // Traer todas las listas necesarias para los <select>
    const departamentos = await Departamento.findAll();
    const estat = await Estat.findAll();
    const prioritats = await Prioritat.findAll();
    const tecnics = await Tecnic.findAll();
    const tipus = await Tipus.findAll();

    res.render('incidencies/edit', {
      incidencia,
      departamentos,
      estats: estat,        // <-- aquí
      prioritats,   // <-- y aquí
      tecnics,      // <-- y aquí
      tipus         // <-- y aquí
    });
  } catch (error) {
    console.error('Error al cargar la incidencia:', error);
    res.status(500).send('Error al cargar la incidencia para editar');
  }
});


  // Actualizar incidencia
  router.post('/:id/update', async (req, res) => {
  try {
    const {
      nom,
      departament_id,
      estat_id,
      prioritat_id,
      tecnic_id,
      tipus_id,
      descripcio,
      dataresolucio
    } = req.body;

    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) {
      return res.status(404).send('Incidencia no encontrada');
    }

    incidencia.nom             = nom;
    incidencia.departament_id  = departament_id;
    incidencia.estat_id        = estat_id;
    incidencia.prioritat_id    = prioritat_id || null;
    incidencia.tecnic_id       = tecnic_id || null;
    incidencia.tipus_id        = tipus_id;
    incidencia.descripcio      = descripcio;
    incidencia.dataresolucio   = dataresolucio ? dataresolucio : null;

    await incidencia.save();
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
