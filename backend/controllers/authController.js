// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const client = require('../db');  // Importar la conexión a la base de datos
const logger = require('../logger');  // Importar el logger


const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario existe en el esquema medical_record
    const userCheckQuery = 'SELECT * FROM medical_record.users WHERE username = $1';  // Especificar el esquema
    const checkResult = await client.query(userCheckQuery, [username]);

    if (checkResult.rows.length === 0) {
      // Log si el usuario no es encontrado
      logger.warn(`Intento de login fallido: Usuario no encontrado - ${username}`);
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = checkResult.rows[0];

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      // Log si la contraseña es incorrecta
      logger.warn(`Intento de login fallido: Contraseña incorrecta para el usuario - ${username}`);
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Si el usuario y la contraseña son correctos
    logger.info(`Login exitoso: ${username} se ha autenticado correctamente`);  // Log para éxito
    res.status(200).json({
      message: 'Login exitoso',
      user: { id: user.id, username: user.username, role: user.role, provider_id: user.provider_id }
    });
  } catch (error) {
    logger.error(`Error en el login para ${username}: ${error.message}`);  // Log de error
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  login,
};
