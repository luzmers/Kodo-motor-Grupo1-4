/**
 * Entrada Principal del Servidor HTTP
 */
require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, async () => {
  console.log('======================================================');
  console.log(`🚗 KODO MOTORS API - Servidor Inicializado`);
  console.log(`📡 URL Base:        http://localhost:${PORT}`);
  console.log(`📦 Repuestos:       http://localhost:${PORT}/api/repuestos`);
  console.log(`⭐ Encuestas:       http://localhost:${PORT}/api/encuestas`);
  console.log('======================================================');

  await testConnection();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ [ERROR] El puerto ${PORT} ya está ocupado.`);
    console.error(`💡 Cambia el PORT en tu archivo .env o cierra el proceso que lo usa.`);
  } else {
    console.error('❌ Error fatal al iniciar el servidor:', err);
  }
});
