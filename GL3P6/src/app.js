const express = require('express');
const path = require('path');
const sequelize = require('./db');
const app = express();
const incidenciaRoutes = require('./routes/incidencies.routes');
const admin = require('./routes/admin.routes');
const tecnic = require('./routes/tecnic.routes');
const Estat = require('./models/estat'); // O ajusta la ruta según corresponda
const Departamento = require('./models/departament'); // Asegúrate también de importar Departamento
const Tecnic = require('./models/tecnic');

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Ruta a tus vistas
app.use(express.urlencoded({ extended: true })); 

// Rutas de incidencias
app.use('/incidencies', incidenciaRoutes);
app.use('/admin', admin);
app.use('/tecnic', tecnic);

// Ruta de prueba
app.get('/', (req, res) => {
  res.render('index', { incidencia: null, error: null });  // Pasa incidencia y error como null por defecto
});

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
          nom: tecnico.nom, // Asegúrate de que 'nom' es correcto
          cognoms: tecnico.cognoms, // Asegúrate de que 'cognoms' es correcto
          email: tecnico.email // Asegúrate de que 'email' es correcto
        }
      });
    }    
    
    console.log('Técnicos iniciales verificados o creados');

    // Iniciar el servidor
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error sincronizando las tablas:', err);
  });
