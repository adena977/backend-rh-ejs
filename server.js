const app = require('./app');
const PORT = process.env.PORT || 3000;



app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur démarré : http://192.168.1.7:${PORT}`);
});
