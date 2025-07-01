// backend/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const { createPatient, searchPatient, getAllPatients } = require('../controllers/patientController');  // Asegúrate de que esté importado correctamente

/**
 * @swagger
 * /patients/create:
 *   post:
 *     summary: Crear un nuevo paciente
 *     tags: [Patients]
 *     description: Permite crear un nuevo paciente con nombre, apellido, fecha de nacimiento, género, documento, teléfono, dirección, tipo de sangre y alergias.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               document_number:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               blood_type:
 *                 type: string
 *               allergies:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paciente registrado exitosamente
 *       400:
 *         description: El número de documento ya está registrado
 *       500:
 *         description: Error en el servidor
 */
router.post('/patients/create', createPatient);  // Ruta para crear un nuevo paciente
/**
 * @swagger
 * /patients/search:
 *   get:
 *     summary: Buscar pacientes por nombre, apellido o número de documento
 *     tags: [Patients]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre, apellido o número de cédula del paciente
 *     responses:
 *       200:
 *         description: Paciente(s) encontrado(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 patients:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Parámetro de búsqueda no válido
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.get('/patients/search', searchPatient);  // Ruta para buscar pacientes
/**
 * @swagger
 * /patients/all:
 *   get:
 *     summary: Obtener todos los pacientes
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: Lista de todos los pacientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       document_number:
 *                         type: string
 *                       birth_date:
 *                         type: string
 *                         format: date
 *                       gender:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       address:
 *                         type: string
 *                       blood_type:
 *                         type: string
 *                       allergies:
 *                         type: string
 *       500:
 *         description: Error interno del servidor
 */

router.get('/patients/all', getAllPatients);
module.exports = router;
