// controllers/treatmentController.js
const pool = require('../db');
const logger = require('../logger');  // Importar el logger
/**
 * @swagger
 * /treatments:
 *   post:
 *     summary: Registrar una nueva receta médica
 *     tags: [Treatments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultation_id
 *               - medication
 *               - dosage
 *               - frequency
 *               - duration
 *             properties:
 *               consultation_id:
 *                 type: integer
 *               medication:
 *                 type: string
 *               dosage:
 *                 type: string
 *               frequency:
 *                 type: string
 *               duration:
 *                 type: string
 *     responses:
 *       201:
 *         description: Receta registrada exitosamente
 *       500:
 *         description: Error en el servidor
 */
const createTreatment = async (req, res) => {
  const { consultation_id, medication, dosage, frequency, duration } = req.body;

  try {
    const query = `
      INSERT INTO medical_record.treatments 
      (consultation_id, medication, dosage, frequency, duration)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [consultation_id, medication, dosage, frequency, duration];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
      logger.info(`Registro de receta exitoso ${res}`);
  } catch (error) {
    console.error('Error al registrar tratamiento:', error);
      logger.error(`Registro de receta erroneo ${error}`);
    res.status(500).json({ message: 'Error al registrar el tratamiento' });
  }
};

module.exports = {
  createTreatment,
};
