// routes/consultationRoutes.js
const express = require('express');
const router = express.Router();
const { createConsultation } = require('../controllers/consultationController');
const { getPatientHistory } = require('../controllers/consultationController');
const { getLastConsultation } = require('../controllers/consultationController');

// Nueva ruta para obtener la última consulta
router.get('/consultations/last', getLastConsultation);


router.post('/consultations/register', createConsultation);

router.get('/consultations/history', getPatientHistory);

module.exports = router;
