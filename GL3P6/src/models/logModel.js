const mongoose = require('mongoose');

// Define el esquema del log
const logSchema = new mongoose.Schema({
  url: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Crea y exporta el modelo Log
const Log = mongoose.model('Log', logSchema);
module.exports = Log;
