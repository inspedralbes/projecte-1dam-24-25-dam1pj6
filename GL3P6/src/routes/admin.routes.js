const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const Incidencia = require('../models/incidencia'); 
const Departamento = require('../models/departament'); 
const Estat = require('../models/estat'); 
const Tecnic = require('../models/tecnic');
const Actuacio = require('../models/actuacio');
const Prioritat = require('../models/prioritat');
const Tipus = require('../models/tipus');
const { obtenerEstadisticas } = require('../models/estadistiquesMongo');



// Mostrar listado de incidencias
router.get('/', async (req, res) => {
  try {
    const { search, estat } = req.query;  // Obtener los filtros de búsqueda

    // Crear los filtros de búsqueda
    let whereConditions = {};

    if (search) {
      whereConditions.nom = { [Op.like]: `%${search}%` };  // Filtro por nombre
    }

    // Mapeamos el filtro 'estat' a los valores correctos de la base de datos
    if (estat) {
      if (estat === 'pendiente') {
        whereConditions.estat_id = { [Op.eq]: 1 };  // "Pendiente d'assignar"
      } else if (estat === 'assignada') {
        whereConditions.estat_id = { [Op.eq]: 2 };  // "Assignada"
      } else if (estat === 'en_proces') {
        whereConditions.estat_id = { [Op.eq]: 3 };  // "En procés"
      } else if (estat === 'resuelta') {
        whereConditions.estat_id = { [Op.eq]: 4 };  // "Resolta"
      }
    }

    // Realizar la consulta con los filtros aplicados
    const incidencies = await Incidencia.findAll({
      where: whereConditions,  // Aplicar los filtros
      include: [
        { model: Departamento, as: 'departament' },
        { model: Estat, as: 'estat' },
        { model: Tecnic, as: 'tecnic' }, 
        { model: Prioritat, as: 'prioritat' },
        { model: Tipus, as: 'tipus' }
      ]
    });

    // Renderizar la vista con los filtros aplicados
    res.render('admin/index', { incidencies, search, estat });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al carregar les incidències' + error);
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
    const prioritats = await Prioritat.findAll();  
    const tipus = await Tipus.findAll();  // Cambié 'Tipus' a 'tipus'

    res.render('admin/edit', {
      incidencia,
      departamentos,
      estats,
      tecnics,
      prioritats,
      tipus  // Usa 'tipus' aquí en lugar de 'Tipus'
    });
  } catch (error) {
    console.error('Error al cargar la incidencia:', error);
    res.status(500).send('Error al cargar la incidencia ' + error);
  }
});


// Actualizar incidencia
router.post('/:id/update', async (req, res) => {
  try {
    const {
      nom,
      departament_id,
      tipus_id,
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
    incidencia.tipus_id = tipus_id;
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

// Ruta para ver las actuaciones de una incidencia
router.get('/:id/actuacions', async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    const incidencia = await Incidencia.findByPk(incidenciaId, {
      include: [
        { model: Departamento, as: 'departament' },
        { model: Estat, as: 'estat' },
        { model: Tecnic, as: 'tecnic' },
        { model: Actuacio, as: 'actuacions' }  
      ]
    });

    if (!incidencia) {
      return res.status(404).send('Incidència no trobada');
    }
    res.render('actuacions/list', {
      incidencia,
      actuacions: incidencia.actuacions || []
    });    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al mostrar les actuacions ' + error);
  }
});

// ACTUACIONS

// Mostrar actuacions de una incidència
router.get('/:id/actuacions', async (req, res) => {
  try {
    const incidenciaId = req.params.id;
    const incidencia = await Incidencia.findByPk(incidenciaId, {
      include: [
        { model: Departamento, as: 'departament' },
        { model: Estat, as: 'estat' },
        { model: Tecnic, as: 'tecnic' }, // Incluimos el técnico aquí
        { model: Actuacio, as: 'actuacions' }  
      ]
    });

    if (!incidencia) {
      return res.status(404).send('Incidència no trobada');
    }

    // Accede al técnico desde la incidencia
    const tecnic = incidencia.tecnic;

    // Pasa 'tecnic' correctamente a la vista
    res.render('actuacions/list', {
      incidencia,
      actuacions: incidencia.actuacions || [],
      tecnic // Asegúrate de pasar esta variable
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al mostrar les actuacions ' + error);
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


//ESTADISTIQUES MONGO

router.get('/estadistiques', async (req, res) => {
  try {
    const estadistiques = await obtenerEstadisticas();
    res.render('admin/estadistiques', { estadistiques });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error obtenint les estadístiques' + error);
  }
});


module.exports = router;
