// routes/treatmentRoutes.js
const express = require('express');
const router = express.Router();
const { createTreatment } = require('../controllers/treatmentController');

router.post('/treatments', createTreatment);

module.exports = router;
