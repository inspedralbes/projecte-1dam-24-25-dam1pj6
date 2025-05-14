const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://a22roblotlot_admin:Rl5941rl@cluster0.izt6ned.mongodb.net/logsApp?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

module.exports = mongoose;
