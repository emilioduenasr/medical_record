// routes/icd10Routes.js
const express = require('express');
const router = express.Router();
const { getAllICD10 } = require('../controllers/icd10Controller');
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
 *      500:
 *         description: Error en el servidor
 *      400:
 *         description: No se encuentran los datos
 *
 */
router.get('/icd10', getAllICD10);

module.exports = router;
