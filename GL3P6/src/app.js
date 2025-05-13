const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// Import routes
const incidenciaRoutes = require('./routes/incidencies.routes');
const admin = require('./routes/admin.routes');
const tecnic = require('./routes/tecnic.routes');

// Import Mongoose models
const Estat = require('./models/estat');
const Departament = require('./models/departament');
const Tecnic = require('./models/tecnic');
const Prioritat = require('./models/prioritat');

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/incidencies', incidenciaRoutes);
app.use('/admin', admin);
app.use('/tecnic', tecnic);

// Home route
app.get('/', (req, res) => {
  res.render('index', { incidencia: null, error: null });
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://a22roblotlot_admin:Rl5941rl@cluster0.mongodb.net/motoDb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected');

  // Seed default data

  const estados = [
    { nom: "Pendent d'assignar" },
    { nom: "Assignada" },
    { nom: "En procés" },
    { nom: "Resolta" }
  ];
  for (const estado of estados) {
    await Estat.findOneAndUpdate({ nom: estado.nom }, estado, { upsert: true });
  }
  console.log('Estados iniciales verificados o creados');

  const departamentos = [
    { nom: "Departament d'Informàtica" },
    { nom: "Departament de Tecnología" },
    { nom: 'Departament de Matemàtiques' },
    { nom: 'Departament de Ciències' }
  ];
  for (const dep of departamentos) {
    await Departament.findOneAndUpdate({ nom: dep.nom }, dep, { upsert: true });
  }
  console.log('Departamentos iniciales verificados o creados');

  const tecnicos = [
    { nom: 'Roberto', cognoms: 'Lotreanu', email: 'a22roblotlot@inspedralbes.cat' },
    { nom: 'Harsh', cognoms: 'Jagani', email: 'a24gaujaghar@inspedralbes.cat' },
    { nom: 'Mateo', cognoms: 'San Martin', email: 'Mateo.sanmartin@mail.com' }
  ];
  for (const tec of tecnicos) {
    await Tecnic.findOneAndUpdate({ email: tec.email }, tec, { upsert: true });
  }
  console.log('Técnicos iniciales verificados o creados');

  const prioritats = [
    { nom: 'Alta' },
    { nom: 'Mitjana' },
    { nom: 'Baixa' }
  ];
  for (const p of prioritats) {
    await Prioritat.findOneAndUpdate({ nom: p.nom }, p, { upsert: true });
  }
  console.log('Prioritats inicials verificades o creades');

  // Start server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor escoltant a http://localhost:${port}`);
  });

}).catch(err => {
  console.error('Error connectant a MongoDB:', err);
});
