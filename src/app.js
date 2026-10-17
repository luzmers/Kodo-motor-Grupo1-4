/**
 * Configuración de Express para Kodo Motors
 * Módulos asignados: 11. Repuestos y 12. Encuestas
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const repuestosRoutes = require('./routes/repuestos.routes');
const encuestasRoutes = require('./routes/encuestas.routes');

const app = express();

// Middlewares globales
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// Endpoint raíz de bienvenida y diagnóstico
app.get('/', (req, res) => {
  res.status(200).json({
    empresa: 'KODO MOTORS',
    proyecto: 'API REST por Capas (EE2)',
    version: '1.0.0',
    estado: 'Servicio en línea',
    recursosDisponibles: {
      repuestos: '/api/repuestos',
      encuestas: '/api/encuestas'
    }
  });
});

// Montaje de las rutas por capa
app.use('/api/repuestos', repuestosRoutes);
app.use('/api/encuestas', encuestasRoutes);

// Manejador global para rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    error: `Ruta "${req.method} ${req.originalUrl}" no encontrada en la API de Kodo Motors`
  });
});

module.exports = app;
