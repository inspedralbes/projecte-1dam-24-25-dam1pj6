const { MongoClient } = require('mongodb');

async function obtenerEstadisticas() {
  const client = new MongoClient('mongodb+srv://a22roblotlot_admin:Rl5941rl@cluster0.izt6ned.mongodb.net/logsApp?retryWrites=true&w=majority&appName=Cluster0');
  await client.connect();
  const db = client.db('logsApp');  
  const logs = db.collection('logs');

  const totalAccessos = await logs.countDocuments();

  // Top 5 URLs más visitadas
  const paginesMesVisitades = await logs.aggregate([
    { $group: { _id: "$url", visites: { $sum: 1 } } },
    { $sort: { visites: -1 } },
    { $limit: 5 }
  ]).toArray();

  // Top 5 userAgents más activos (no es usuario, pero es lo que tienes)
  const usuarisMesActius = await logs.aggregate([
    { $group: { _id: "$userAgent", accessos: { $sum: 1 } } },
    { $sort: { accessos: -1 } },
    { $limit: 5 }
  ]).toArray();

  const avui = new Date();
  const fa30dies = new Date();
  fa30dies.setDate(avui.getDate() - 30);

  // Accesos diarios últimos 30 días según timestamp
  const accessosDiaris = await logs.aggregate([
    { $match: { timestamp: { $gte: fa30dies, $lte: avui } } },
    { $group: {
      _id: { any: { $year: "$timestamp" }, mes: { $month: "$timestamp" }, dia: { $dayOfMonth: "$timestamp" } },
      count: { $sum: 1 }
    }},
    { $sort: { "_id.any": 1, "_id.mes": 1, "_id.dia": 1 } }
  ]).toArray();

  await client.close();

  return {
    totalAccessos,
    paginesMesVisitades,
    usuarisMesActius,
    accessosDiaris
  };
}

module.exports = { obtenerEstadisticas };
