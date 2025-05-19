const mongoose = require('mongoose');

// defineix l'esquema del log
const logSchema = new mongoose.Schema({
  url: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
