const express = require('express');
const Log = require('../models/logModel');
const router = express.Router();


// GET /logs — with optional ?date=YYYY-MM-DD query param
router.get('/', async (req, res) => {
 try {
   const filterDate = req.query.date;
   let logs = [];


   if (filterDate) {
     const start = new Date(filterDate);
     const end = new Date(filterDate);
     end.setDate(end.getDate() + 1);


     logs = await Log.find({
       timestamp: {
         $gte: start,
         $lt: end
       }
     }).sort({ timestamp: -1 });
   } else {
     logs = await Log.find().sort({ timestamp: -1 });
   }


   res.render('logs/index', { logs, filterDate });
 } catch (err) {
   console.error('Error al obtener los logs:', err);
   res.status(500).send('Error al obtener los logs');
 }
});


module.exports = router;
