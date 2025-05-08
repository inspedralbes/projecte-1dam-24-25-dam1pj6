const express = require('express');
const path = require('path');
const sequelize = require('./db'); // Import the sequelize instance (adjust as per your setup)
const tecnicRoutes = require('./routes/tecnic.routes'); // Import the tecnic routes
const incidenciaRoutes = require('./routes/incidencies.routes'); // Import other routes if needed
const adminRoutes = require('./routes/admin.routes'); // If you have an admin route
const Estat = require('./models/estat'); // Import your models
const Departamento = require('./models/departament');
const Tecnic = require('./models/tecnic');

const app = express();

// Setup EJS as the view engine (for rendering .ejs templates)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Adjust the path to your views folder

// Body parsing middleware (for handling form data, JSON, etc.)
app.use(express.urlencoded({ extended: true })); // For POST form data
app.use(express.json()); // For parsing JSON requests

// Serve static files (e.g., CSS, JS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Use the tecnicRoutes for any route prefixed with '/tecnic'
app.use('/tecnic', tecnicRoutes);

// Use the admin routes if needed (example, adjust according to your setup)
app.use('/admin', adminRoutes);

// Use the incidencies routes if needed (example, adjust according to your setup)
app.use('/incidencies', incidenciaRoutes);

// Test route (optional)
app.get('/', (req, res) => {
  res.render('index', { message: 'Welcome to the Incidencies App!' });
});

// Synchronize database (sequelize sync)
sequelize.sync({ force: false })
  .then(async () => {
    console.log('Las tablas se han sincronizado correctamente');

    const estados = [
      { nom: "Pendent d'assignar" },
      { nom: "Assignada" },
      { nom: "En procés" },
      { nom: "Resolta" }
    ];

    for (const estado of estados) {
      await Estat.findOrCreate({
        where: { nom: estado.nom }
      });
    }

    console.log('Estados iniciales verificados o creados');

    const departamentos = [
      { nom: "Departament d'Informàtica" },
      { nom: "Departament de Tecnología" },
      { nom: 'Departament de Matemàtiques' },
      { nom: 'Departament de Ciències' }
    ];

    for (const departamento of departamentos) {
      await Departamento.findOrCreate({
        where: { nom: departamento.nom }
      });
    }

    console.log('Departamentos iniciales verificados o creados');

    const tecnicos = [
      { nom: 'Roberto', cognoms: 'Lotreanu', email: 'a22roblotlot@inspedralbes.cat' },
      { nom: 'Harsh', cognoms: 'Jagani', email: 'a24gaujaghar@inspedralbes.cat' },
      { nom: 'Mateo', cognoms: 'San Martin', email: 'Mateo.sanmartin@mail.com' }
    ];

    for (const tecnico of tecnicos) {
      await Tecnic.findOrCreate({
        where: { email: tecnico.email }, // Verificamos por mail para evitar duplicados
        defaults: {
          nom: tecnico.nom,
          cognoms: tecnico.cognoms,
          email: tecnico.email
        }
      });
    }

    console.log('Técnicos iniciales verificados o creados');

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error sincronizando las tablas:', err);
  });
