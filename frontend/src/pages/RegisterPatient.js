import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import axios from 'axios';

const RegisterPatient = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    document_number: '',
    birth_date: '',
    phone: '',
    address: '',
    gender: '',
    blood_type: '',
    allergies: '',
    emergency_contact: '',
  });

  const [message, setMessage] = useState({ text: '', severity: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setMessage({ text: '', severity: '' });

    // Validar campos obligatorios
    const { first_name, last_name, document_number, birth_date } = form;
    if (
      !first_name.trim() ||
      !last_name.trim() ||
      !document_number.trim() ||
      !birth_date.trim()
    ) {
      setMessage({ text: 'Por favor complete todos los campos obligatorios (*)', severity: 'warning' });
      console.warn('⚠️ Campos requeridos incompletos');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/patients/create', form);
      if (response.status === 201) {
        console.log('✅ Paciente registrado correctamente:', response.data);
        setMessage({ text: 'Paciente registrado exitosamente', severity: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);

        // Limpiar el formulario
        setForm({
          first_name: '',
          last_name: '',
          document_number: '',
          birth_date: '',
          phone: '',
          address: '',
          gender: '',
          blood_type: '',
          allergies: '',
          emergency_contact: '',
        });
      }
    } catch (error) {
      console.error('❌ Error al registrar paciente:', error.response?.data || error.message);
      setMessage({
        text: 'Error al registrar el paciente. Intente nuevamente.',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Registrar Paciente
      </Typography>

      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="first_name"
              label="Nombre *"
              fullWidth
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="last_name"
              label="Apellido *"
              fullWidth
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="document_number"
              label="Cédula *"
              fullWidth
              value={form.document_number}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="birth_date"
              label="Fecha de Nacimiento *"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={form.birth_date}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Teléfono"
              fullWidth
              value={form.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="address"
              label="Dirección"
              fullWidth
              value={form.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="gender"
              label="Género"
              fullWidth
              value={form.gender}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="blood_type"
              label="Tipo de Sangre"
              fullWidth
              value={form.blood_type}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="allergies"
              label="Alergias"
              fullWidth
              value={form.allergies}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="emergency_contact"
              label="Contacto de Emergencia"
              fullWidth
              value={form.emergency_contact}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Registrar Paciente
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RegisterPatient;
