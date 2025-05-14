const express = require('express');
const Log = require('../models/logModel');  // Asegúrate de importar tu modelo de log
const router = express.Router();

// Ruta para mostrar los logs
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }); // Obtén los logs y ordénalos por la fecha
    res.render('logs/index', { logs });
  } catch (err) {
    console.error('Error al obtener los logs:', err);
    res.status(500).send('Error al obtener los logs');
  }
});

module.exports = router;
