const express = require('express');
const router = express.Router();
const Incidencia = require('../models/incidencia');  
const Departamento = require('../models/departament'); 
const Estat = require('../models/estat'); // Asegúrate de que el modelo Estat esté importado correctamente

// Obtener todas las incidencias
router.get('/', async (req, res) => {
  try {
    const incidencies = await Incidencia.findAll({
      include: [
        {
          model: Departamento, // Incluimos el modelo Departamento
          as: 'departament',   // Usamos el alias definido en la relación
        },
        {
          model: Estat,        // Incluimos el modelo Estat
          as: 'estat',         // Usamos el alias definido en la relación
        }
      ],
    });
    res.render('incidencies/list', { incidencies });
  } catch (error) {
    console.error('Error al obtener incidencias:', error);  
    res.status(500).send('Error al obtener incidencias');
  }
});

// Crear nueva incidencia (GET)
router.get('/new', async (req, res) => {
  try {
    const departamentos = await Departamento.findAll();  
    res.render('incidencies/new', { departamentos });  
  } catch (error) {
    console.error('Error al cargar los departamentos:', error);
    res.status(500).send('Error al cargar los departamentos');
  }
});

// Crear nueva incidencia (POST)
router.post('/create', async (req, res) => {
  try {
    const { nom, departament_id, tipus, descripcio } = req.body;  // Usar departament_id

    const moment = require('moment-timezone');
    const dataCreacio = moment().tz('Europe/Madrid').toDate(); 
    const estat = "Pendent d'assignacio";
    const dataResolucio = null;
    const tecnic = null;

    // Crear la incidencia
    const incidencia = await Incidencia.create({
      nom,
      departament_id,  // Usamos departament_id
      tipus,
      descripcio,
      dataCreacio,
      estat,
      tecnic,
      dataResolucio,
    });

    console.log('Incidencia creada:', incidencia);  // Para verificar si la incidencia fue creada
    res.redirect('/incidencies');
  } catch (error) {
    console.error('Error al crear la incidencia:', error);  // Para ver el error en consola
    res.status(500).send("No s'ha pogut crear l'incidencia" + error);
  }
});

// Editar incidencia (GET)
router.get('/:id/edit', async (req, res) => {
  try {
    const departamentos = await Departamento.findAll();  // Obtener todos los departamentos
    const incidencia = await Incidencia.findByPk(req.params.id, {
      include: [
        {
          model: Departamento, // Incluir el departamento al editar
          as: 'departament',
        },
        {
          model: Estat, // Incluir el estado de la incidencia
          as: 'estat',
        }
      ]
    });

    if (!incidencia) {
      return res.status(404).send('Incidencia no encontrada');
    }

    res.render('incidencies/edit', { incidencia, departamentos });
  } catch (error) {
    console.error('Error al cargar la incidencia:', error);
    res.status(500).send('Error al cargar la incidencia para editar');
  }
});

// Actualizar incidencia (POST)
router.post('/:id/update', async (req, res) => {
  try {
    const { nom, departament_id, tipus, descripcio } = req.body;  // Usar departament_id
    const { id } = req.params; // Obtener el id de la URL

    const incidencia = await Incidencia.findByPk(id);
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
    res.status(500).send('No s\'ha pogut actualitzar l\'incidència' + error);
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
    res.status(500).send('Error al eliminar la incidencia' + error);
  }
});

module.exports = router;
