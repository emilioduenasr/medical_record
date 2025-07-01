// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController'); // Importar la función de login del controlador

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login para el usuario
 *     tags: [Login]
 *     description: Permite al usuario autenticarse proporcionando su nombre de usuario y contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "admin"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', login);

module.exports = router;
