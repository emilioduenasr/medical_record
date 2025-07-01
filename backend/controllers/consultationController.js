// controllers/consultationController.js
const pool = require('../db');
const logger = require("../logger");
const client = require("../db");

/**
 * @swagger
 * /consultations/register:
 *   post:
 *     summary: Crear una nueva consulta médica
 *     tags: [Consultations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - provider_id
 *               - date
 *               - reason
 *               - icd10_id
 *             properties:
 *               patient_id:
 *                 type: integer
 *               provider_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *               icd10_id:
 *                 type: integer
 *               recommendations:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consulta creada exitosamente
 *       500:
 *         description: Error en el servidor
 */
const createConsultation = async (req, res) => {
  const { patient_id, provider_id, date, reason, icd10_id, recommendations,diagnosis, type_diagnosis } = req.body;

  try {
    const query = `
      INSERT INTO medical_record.consultations 
      (patient_id, provider_id, date, reason, icd10_id, recommendations, diagnosis, type_diagnosis)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [patient_id, provider_id, date, reason, icd10_id, recommendations, diagnosis, type_diagnosis];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
    logger.info(`Registro de consulta exitoso ${res}, para paciente ${patient_id}`);
  } catch (error) {
    console.error('Error al crear la consulta:', error);
    logger.info(`Registro de consulta erroneo ${error}`);
    res.status(500).json({ message: 'Error al crear la consulta médica' });
  }
};
/**
 * @swagger
 * /consultations/history:
 *   get:
 *     summary: Obtener historial médico de un paciente
 *     description: Retorna todas las consultas registradas para un paciente dado su ID.
 *     tags:
 *       - Consultations
 *     parameters:
 *       - in: query
 *         name: patient_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Lista de consultas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consultations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       reason:
 *                         type: string
 *                       diagnosis:
 *                         type: string
 *                       type_diagnosis:
 *                         type: string
 *                       icd10_code:
 *                         type: string
 *                       icd10_description:
 *                         type: string
 *                       recommendations:
 *                         type: string
 *       400:
 *         description: Falta el parámetro patient_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: No se encontraron consultas para el paciente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

const getPatientHistory = async (req, res) => {
  const { patient_id } = req.query;

  if (!patient_id) {
    return res.status(400).json({ message: 'Se requiere el ID del paciente' });
  }

  try {
    const query = `
      SELECT 
        c.date,
        c.reason,
        c.diagnosis,
        c.type_diagnosis,
        ic.code AS icd10_code,
        ic.description AS icd10_description,
        c.recommendations
      FROM 
        medical_record.consultations c
      LEFT JOIN 
        medical_record.icd10 ic ON c.icd10_id = ic.id
      WHERE 
        c.patient_id = $1
      ORDER BY 
        c.date DESC
    `;
    const result = await client.query(query, [patient_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron consultas para este paciente' });
    }

    logger.info(`Historial médico recuperado para el paciente ID ${patient_id}`);
    return res.status(200).json({ consultations: result.rows });
  } catch (error) {
    logger.error(`Error al obtener historial médico: ${error.message}`);
    return res.status(500).json({ message: 'Error al obtener el historial médico' });
  }
};

/**
 * Obtener la última consulta registrada para un paciente
 * @route GET /api/consultations/last
 */
const getLastConsultation = async (req, res) => {
  const { patient_id } = req.query;

  if (!patient_id) {
    return res.status(400).json({ message: 'El ID del paciente es requerido' });
  }

  try {
    const query = `
      SELECT * FROM medical_record.consultations
      WHERE patient_id = $1
      ORDER BY date DESC
      LIMIT 1
    `;
    const result = await client.query(query, [patient_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró consulta para este paciente' });
    }

    res.status(200).json({ consultation: result.rows[0] });
  } catch (error) {
    logger.error(`Error al obtener la última consulta: ${error.message}`);
    res.status(500).json({ message: 'Error al obtener la última consulta' });
  }
};



module.exports = {
  createConsultation,
    getPatientHistory, getLastConsultation,
};
