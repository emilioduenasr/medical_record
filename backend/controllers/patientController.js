// backend/controllers/patientController.js
const client = require('../db');  // Importar la conexión a la base de datos
const logger = require('../logger');  // Importar el logger

/**
 * Función para crear un nuevo paciente
 */
const createPatient = async (req, res) => {
  const { first_name, last_name, birth_date, gender, document_number, phone, address, blood_type, allergies } = req.body;

  try {
    // Verificar si el número de documento ya está registrado en la tabla medical_record.patients
    const documentCheckQuery = 'SELECT * FROM medical_record.patients WHERE document_number = $1';  // Especificar el esquema
    const documentCheckResult = await client.query(documentCheckQuery, [document_number]);

    // Si el paciente con el mismo documento ya existe, devolver un mensaje de error
    if (documentCheckResult.rows.length > 0) {
      return res.status(400).json({ message: 'El número de documento ya está registrado' });
    }

    // Insertar el nuevo paciente en la base de datos (en el esquema medical_record)
    const insertQuery = `
      INSERT INTO medical_record.patients (first_name, last_name, birth_date, gender, document_number, phone, address, blood_type, allergies)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, first_name, last_name, birth_date, gender, document_number, phone, address, blood_type, allergies
    `;  // Especificar el esquema medical_record
    const insertValues = [
      first_name,
      last_name,
      birth_date,
      gender,
      document_number,
      phone || null,  // Si no se proporciona, lo configuramos como NULL
      address || null,  // Si no se proporciona, lo configuramos como NULL
      blood_type || null,  // Si no se proporciona, lo configuramos como NULL
      allergies || null  // Si no se proporciona, lo configuramos como NULL
    ];

    const insertResult = await client.query(insertQuery, insertValues);
    const newPatient = insertResult.rows[0];

    // Log para registrar el nuevo paciente
    logger.info(`Nuevo paciente registrado: ${first_name} ${last_name} (${document_number})`);

    // Responder con los datos del nuevo paciente registrado
    res.status(201).json({
      message: 'Paciente registrado exitosamente',
      patient: newPatient,
    });
  } catch (error) {
    logger.error(`Error al registrar el paciente: ${error.message}`);
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el paciente' });
  }
};

/**
 * Función para buscar pacientes por nombre o número de documento
 */
const searchPatient = async (req, res) => {
  const { first_name, last_name, document_number } = req.query;  // Buscar por parámetros de consulta (query)

  try {
    // Construir la consulta dinámica basándonos en los parámetros que se proporcionen
    let query = 'SELECT * FROM medical_record.patients WHERE ';
    let values = [];
    let conditions = [];

    // Condiciones de búsqueda
    if (first_name) {
      conditions.push('first_name ILIKE $' + (values.length + 1));  // Busca por nombre
      values.push('%' + first_name + '%');
    }

    if (last_name) {
      conditions.push('last_name ILIKE $' + (values.length + 1));  // Busca por apellido
      values.push('%' + last_name + '%');
    }

    if (document_number) {
      conditions.push('document_number = $' + (values.length + 1));  // Busca por número de documento
      values.push(document_number);
    }

    if (conditions.length === 0) {
      return res.status(400).json({ message: 'Debe proporcionar al menos un parámetro de búsqueda' });
    }

    query += conditions.join(' AND ');  // Unir todas las condiciones con 'AND'

    // Ejecutar la consulta
    const result = await client.query(query, values);

    // Si no se encuentra el paciente
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    // Log de la búsqueda
    logger.info(`Búsqueda de paciente realizada con éxito: ${JSON.stringify(req.query)}`);

    // Responder con los pacientes encontrados
    res.status(200).json({ message: 'Paciente(s) encontrado(s)', patients: result.rows });
  } catch (error) {
    logger.error(`Error al buscar paciente: ${error.message}`);
    console.error(error);
    res.status(500).json({ message: 'Error al buscar paciente' });
  }
};

module.exports = {
  createPatient,  // Para la creación del paciente
  searchPatient,  // Para la búsqueda de paciente
};
