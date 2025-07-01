// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *         tags: [Usuario]
 *     description: Permite crear un nuevo usuario con nombre de usuario, contraseña, rol y proveedor (opcional).
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
 *               role:
 *                 type: string
 *               provider_id:
 *                 type: string
 *               example:
 *                 username: "newUser"
 *                 password: "securePassword123"
 *                 role: "user"
 *                 provider_id: "provider123"  # Este campo es opcional
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: El nombre de usuario ya está en uso
 *       500:
 *         description: Error en el servidor
 */
router.post('/users', createUser);

module.exports = router;
