// backend/controllers/userController.js
const bcrypt = require('bcryptjs');
const client = require('../db');  // Importar la conexión a la base de datos

/**
 * Función para crear un nuevo usuario
 */
const createUser = async (req, res) => {
  const { username, password, role, provider_id } = req.body;

  try {
    // Verificar si el nombre de usuario ya está en uso en el esquema medical_record
    const userCheckQuery = 'SELECT * FROM medical_record.users WHERE username = $1'; // Especificar el esquema
    const checkResult = await client.query(userCheckQuery, [username]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la base de datos (en el esquema medical_record)
    const insertQuery = `
      INSERT INTO medical_record.users (username, password_hash, role, provider_id)
      VALUES ($1, $2, $3, $4) RETURNING id, username, role, provider_id
    `; // Especificar el esquema
    const insertValues = [
      username,
      passwordHash,
      role,
      provider_id || null  // Si provider_id no se proporciona, lo configuramos como NULL
    ];

    const insertResult = await client.query(insertQuery, insertValues);
    const newUser = insertResult.rows[0];

    // Responder con el nuevo usuario creado
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

module.exports = {
  createUser,
};
