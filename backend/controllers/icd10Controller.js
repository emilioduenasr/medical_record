// controllers/icd10Controller.js
const pool = require('../db'); // Asegúrate de tener la conexión configurada en db.js
const logger = require('../logger');  // Importar el logger
/**
 * @swagger
 * /icd10:
 *   get:
 *     summary: Obtener todos los registros de la tabla ICD10
 *     tags: [ICD10]
 *     responses:
 *       200:
 *         description: Lista de códigos ICD10
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *
 */
const getAllICD10 = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medical_record.icd10');
    res.status(200).json(result.rows);
    logger.info(`Solicitud de ICD10 exitosa ${res}`);
  } catch (error) {
    console.error('Error al obtener datos de ICD10:', error);
      logger.info(`Error al obtener ICD10: ${error} )`);
    res.status(500).json({ message: 'Error al obtener los códigos ICD10' });
  }
};

module.exports = {
  getAllICD10,
};
