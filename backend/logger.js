// backend/logger.js
const winston = require('winston');
const moment = require('moment');  // Si usas moment.js

// Configurar el nombre del archivo con la fecha actual
const logFileName = `logs/applog_${moment().format('YYYY-MM-DD')}.log`; // Usando moment.js


// Configuración de los transportes para consola y archivo
const logger = winston.createLogger({
  level: 'info',  // Nivel de log por defecto (puede ser 'debug', 'info', 'warn', 'error')
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Agrega la hora en formato 'YYYY-MM-DD HH:mm:ss'
    winston.format.printf(({ timestamp, message }) => {
      return `${timestamp} ${message}`;  // Solo imprime la hora y el mensaje
    })
  ),
  transports: [
    // Log en consola (sin colores)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.simple()  // Usa el formato simple sin color
      )
    }),
    // Log en archivo con el nombre basado en la fecha
    new winston.transports.File({ filename: logFileName })
  ]
});

// Exportar el logger para usarlo en otros archivos
module.exports = logger;
