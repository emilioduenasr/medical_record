// backend/db.js
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();  // Cargar variables de entorno

const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,  // Esto permite que no se rechace la conexión si el certificado no es verificado
  },
});

client.connect()
  .then(() => console.log('Conectado a la base de datos PostgreSQL (Neon)'))
  .catch((err) => {
    console.error('Error al conectar con PostgreSQL', err.stack);
    process.exit(1); // Salir si la conexión falla
  });


module.exports = client;
