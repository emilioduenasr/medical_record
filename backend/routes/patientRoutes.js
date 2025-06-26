// backend/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const { createPatient, searchPatient } = require('../controllers/patientController');  // Asegúrate de que esté importado correctamente

/**
 * @swagger
 * /patients/create:
 *   post:
 *     summary: Crear un nuevo paciente
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
 *     summary: Buscar un paciente por nombre o documento
 *     description: Permite buscar un paciente por nombre, apellido o número de documento.
 *     parameters:
 *       - name: first_name
 *         in: query
 *         description: Nombre del paciente para la búsqueda
 *         required: false
 *         schema:
 *           type: string
 *       - name: last_name
 *         in: query
 *         description: Apellido del paciente para la búsqueda
 *         required: false
 *         schema:
 *           type: string
 *       - name: document_number
 *         in: query
 *         description: Número de documento del paciente para la búsqueda
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente(s) encontrado(s)
 *       400:
 *         description: Parámetro de búsqueda no válido
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/patients/search', searchPatient);  // Ruta para buscar pacientes

module.exports = router;
