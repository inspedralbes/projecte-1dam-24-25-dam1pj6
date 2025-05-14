const express = require('express');
const path = require('path');
const sequelize = require('./db');
const app = express();
const incidenciaRoutes = require('./routes/incidencies.routes');
const admin = require('./routes/admin.routes');
const tecnic = require('./routes/tecnic.routes');
const Estat = require('./models/estat'); 
const Departamento = require('./models/departament'); 
const Tecnic = require('./models/tecnic');
const Prioritat = require('./models/prioritat');
const Tipus = require('./models/tipus'); 
const Incidencia = require('./models/incidencia');
const Actuacio = require('./models/actuacio');


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
        where: { email: tecnico.email }, 
        defaults: {
          nom: tecnico.nom, 
          cognoms: tecnico.cognoms, 
          email: tecnico.email 
        }
      });
    }    
    
    console.log('Técnicos iniciales verificados o creados');

    const prioritats = [
      { nom: 'Alta' },
      { nom: 'Mitjana' },
      { nom: 'Baixa' }
    ];

    for (const prioritat of prioritats) {
      await Prioritat.findOrCreate({
        where: { nom: prioritat.nom },
        defaults: { nom: prioritat.nom }
      });
}

console.log('Prioritats inicials verificades o creades');

  const tipusList = [
  { nom: 'Hardware' },
  { nom: 'Software' },
  { nom: 'Xarxes' },
  { nom: 'Altres' }
];

for (const tipus of tipusList) {
  await Tipus.findOrCreate({
    where: { nom: tipus.nom },
    defaults: { nom: tipus.nom }
  });
}

console.log('Tipus inicials verificats o creats');

//CREACIÓ AUTOMÀTICA D'INCIDÈNCIES

const incidenciaDades = [
  {
    nom: "Ordinador no arrenca",
    departament_id: 3,
    tipus_id: 1,
    descripcio: "L'ordinador del professor de matemàtiques no mostra res en pantalla.",
    estat_id: 4,
    tecnic_id: 1,
    prioritat_id: 1,
    dataresolucio: "2025-05-13",
    actuacions: [
      {
        data: "2025-05-10",
        descripcio: "Comprovació del cablejat i font d'alimentació.",
        temps_invertit: 15,
        visible_per_usuari: true,
        resolt: false
      },
      {
        data: "2025-05-11",
        descripcio: "Substitució de la font d'alimentació.",
        temps_invertit: 45,
        visible_per_usuari: false,
        resolt: true
      },
      {
        data: "2025-05-12",
        descripcio: "Proves funcionals post-reparació.",
        temps_invertit: 30,
        visible_per_usuari: true,
        resolt: true
      }
    ]
  },
  {
    nom: "No es pot accedir a la xarxa Wi-Fi",
    departament_id: 1,
    tipus_id: 3,
    descripcio: "Cap dispositiu es connecta a la xarxa del segon pis.",
    estat_id: 3,
    tecnic_id: 2,
    prioritat_id: 2,
    dataresolucio: null,
    actuacions: [
      {
        data: "2025-05-13",
        descripcio: "Reinici del punt d'accés del segon pis.",
        temps_invertit: 10,
        visible_per_usuari: true,
        resolt: false
      },
      {
        data: "2025-05-14",
        descripcio: "Revisió de la configuració DHCP.",
        temps_invertit: 20,
        visible_per_usuari: false,
        resolt: false
      },
      {
        data: "2025-05-14",
        descripcio: "Es detecta avaria a l'switch. Es demana reemplaçament.",
        temps_invertit: 25,
        visible_per_usuari: true,
        resolt: false
      }
    ]
  },
  {
    nom: "Projector no funciona",
    departament_id: 2,
    tipus_id: 1,
    descripcio: "El projector de l'aula de tecnología no mostra imatge.",
    estat_id: 4,
    tecnic_id: 3,
    prioritat_id: 3,
    dataresolucio: "2025-05-10",
    actuacions: [
      {
        data: "2025-05-08",
        descripcio: "Comprovació de la connexió HDMI.",
        temps_invertit: 10,
        visible_per_usuari: true,
        resolt: false
      },
      {
        data: "2025-05-09",
        descripcio: "Substitució del cable HDMI.",
        temps_invertit: 15,
        visible_per_usuari: false,
        resolt: true
      },
      {
        data: "2025-05-10",
        descripcio: "Confirmació de funcionament correcte.",
        temps_invertit: 10,
        visible_per_usuari: true,
        resolt: true
      }
    ]
  },
  {
    nom: "Problema amb el programari de notes",
    departament_id: 4,
    tipus_id: 2,
    descripcio: "L’aplicació de notes no desa els canvis.",
    estat_id: 2,
    tecnic_id: 2,
    prioritat_id: 2,
    dataresolucio: null,
    actuacions: [
      {
        data: "2025-05-12",
        descripcio: "Test en local: no es reprodueix l'error.",
        temps_invertit: 20,
        visible_per_usuari: false,
        resolt: false
      },
      {
        data: "2025-05-13",
        descripcio: "Es demana a l’usuari repetir l’error en viu.",
        temps_invertit: 10,
        visible_per_usuari: true,
        resolt: false
      },
      {
        data: "2025-05-14",
        descripcio: "Possible conflicte amb l'antivirus. S'està comprovant.",
        temps_invertit: 25,
        visible_per_usuari: true,
        resolt: false
      }
    ]
  },
  {
    nom: "Pantalla tàctil no respon",
    departament_id: 1,
    tipus_id: 1,
    descripcio: "La pantalla tàctil del laboratori no respon al tacte.",
    estat_id: 1,
    tecnic_id: null,
    prioritat_id: 1,
    dataresolucio: null,
    actuacions: [
      {
        data: "2025-05-13",
        descripcio: "Informe d’incidència automàtic generat pel sistema.",
        temps_invertit: 0,
        visible_per_usuari: true,
        resolt: false
      },
      {
        data: "2025-05-13",
        descripcio: "Encara pendent d’assignació a tècnic.",
        temps_invertit: 0,
        visible_per_usuari: false,
        resolt: false
      },
      {
        data: "2025-05-14",
        descripcio: "S'ha notificat a l’equip de suport.",
        temps_invertit: 5,
        visible_per_usuari: true,
        resolt: false
      }
    ]
  }
];

  for (const incidencia of incidenciaDades) {
      
      const existingIncidencia = await Incidencia.findOne({
        where: { nom: incidencia.nom }  
      });

      if (!existingIncidencia) {
        await Incidencia.create(incidencia, {
          include: [{ model: Actuacio, as: 'actuacions' }]
        });
        console.log(`Incidència '${incidencia.nom}' creada`);
      } else {
        console.log(`La incidència '${incidencia.nom}' ya existe.`);
      }
    }

console.log('Incidències de prova creades amb actuacions');




    // Iniciar el servidor
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error sincronizando las tablas:', err);
  });
