// backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./logger');  // Importar el logger
const authRoutes = require('./routes/authRoutes');  // Importar las rutas de autenticación
const userRoutes = require('./routes/userRoutes');  // Importar las rutas de usuario
const patientRoutes = require('./routes/patientRoutes');  // Importar las rutas de pacientes
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const icd10Routes = require('./routes/icd10Routes');
const consultationRoutes = require('./routes/consultationRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');


dotenv.config();  // Para cargar variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 5000;  // Puerto configurado en variables de entorno o 5000 por defecto

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medical Record API',
      version: '1.0.0',
      description: 'API documentation for Medical Record App',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',  // URL base para la API
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'],  // Rutas y controladores donde Swagger buscará los comentarios
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Ruta para acceder a la documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  // Ruta correcta para acceder a Swagger

// Middleware
app.use(cors());  // Habilitar CORS
app.use(express.json());  // Para manejar JSON en las solicitudes

// Middleware para registrar todas las solicitudes
app.use((req, res, next) => {
  logger.info(`Nueva solicitud: ${req.method} ${req.url}`);  // Log para cada solicitud
  next();  // Pasar al siguiente middleware o ruta
});

// Usar las rutas de autenticación y pacientes
app.use('/api', authRoutes);  // Asegúrate de que las rutas de autenticación estén correctamente registradas
app.use('/api', userRoutes);  // Asegúrate de que las rutas de usuario estén correctamente registradas
app.use('/api', patientRoutes);  // Asegúrate de que las rutas de pacientes estén correctamente registradas
app.use('/api', icd10Routes);
app.use('/api', consultationRoutes);
app.use('/api', treatmentRoutes);

// Middleware para manejar errores de rutas no encontradas (404)
app.use((req, res, next) => {
  logger.error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);  // Log para rutas no encontradas
  res.status(404).json({ message: `Ruta ${req.originalUrl} no encontrada` });
});

// Manejar errores globales
app.use((err, req, res, next) => {
  logger.error(`Error en el servidor: ${err.message}`);  // Log de errores del servidor
  res.status(500).json({ message: 'Error en el servidor' });
});

// Iniciar el servidor
app.listen(port, () => {
  logger.info(`Backend running on http://localhost:${port}`);
});
