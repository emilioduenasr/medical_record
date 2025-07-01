import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { Autocomplete } from '@mui/material';


const RegisterConsultation = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [patient, setPatient] = useState(null);
  const [message, setMessage] = useState({ text: '', severity: '' });

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: '',
    icd10_id: '',
    recommendations: '',
     diagnosis: '',
  type_diagnosis: '',
  });

  useEffect(() => {
    const fetchICD10 = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/icd10');
        if (response.status === 200) {
          localStorage.setItem('icd10', JSON.stringify(response.data));
          console.log('📥 Datos ICD10 guardados en localStorage');
        }
      } catch (error) {
        console.error('❌ Error al cargar ICD10:', error.message);
      }
    };

    fetchICD10();
  }, []);

  const handleSearch = async () => {
    setMessage({ text: '', severity: '' });
    setPatient(null);

    if (!search.trim()) {
      setMessage({ text: 'Ingrese un valor para buscar', severity: 'warning' });
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/patients/search?q=${search}`
      );

      if (response.status === 200 && response.data.patients.length > 0) {
        const found = response.data.patients[0];
        console.log('✅ Paciente encontrado:', found);
        setPatient(found);
        setMessage({ text: response.data.message, severity: 'success' });
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          setMessage({ text: 'Parámetro de búsqueda no válido', severity: 'warning' });
        } else if (status === 404) {
          setMessage({ text: 'Paciente no encontrado', severity: 'info' });
        } else if (status === 500) {
          setMessage({ text: 'Error en el servidor', severity: 'error' });
        }
      } else {
        setMessage({ text: 'Error de red al buscar paciente', severity: 'error' });
        console.error('❌ Error de red:', error.message);
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!patient) return;

    const payload = {
      patient_id: patient.id,
      provider_id: 1,
      date: form.date,
      reason: form.reason,
      icd10_id: Number(form.icd10_id),
      recommendations: form.recommendations,
      diagnosis: form.diagnosis,
      type_diagnosis: form.type_diagnosis,

    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/consultations/register',
        payload
      );
      if (response.status === 201) {
        setMessage({
          text: 'Consulta médica registrada con éxito. Redirigiendo...',
          severity: 'success',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error al registrar consulta:', error.message);
      setMessage({
        text: error.response?.data?.message || 'Error al registrar la consulta médica',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Registrar Consulta Médica
      </Typography>

      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6">Buscar Paciente</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Buscar por cédula, nombre o apellido"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="contained" onClick={handleSearch}>
            Buscar
          </Button>
        </Box>
      </Paper>

      {patient && (
        <>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información del Paciente
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField label="Nombre" value={patient.first_name} fullWidth disabled /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Apellido" value={patient.last_name} fullWidth disabled /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Cédula" value={patient.document_number} fullWidth disabled /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Fecha de Nacimiento" value={patient.birth_date?.split('T')[0]} fullWidth disabled /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Teléfono" value={patient.phone || ''} fullWidth disabled /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Dirección" value={patient.address || ''} fullWidth disabled /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Género" value={patient.gender} fullWidth disabled /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Tipo de Sangre" value={patient.blood_type} fullWidth disabled /></Grid>
              <Grid item xs={12}><TextField label="Alergias" value={patient.allergies || ''} fullWidth disabled /></Grid>
              <Grid item xs={12}><TextField label="Contacto de Emergencia" value={patient.emergency_contact || ''} fullWidth disabled /></Grid>
            </Grid>
          </Paper>

          <Paper sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detalles de la Consulta
            </Typography>
            {/* Consulta: Fecha y Motivo */}
          <Paper sx={{ padding: 3, marginTop: 3 }}>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Fecha"
                name="date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Motivo de Consulta"
                name="reason"
                fullWidth
                multiline
                minRows={3}
                value={form.reason}
                onChange={handleChange}
              />
            </Box>
          </Paper>

          {/* Diagnóstico libre y tipo */}
          <Paper sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Diagnóstico
            </Typography>

            <Stack spacing={2}>
    <TextField
      label="Diagnóstico"
      name="diagnosis"
      fullWidth
      multiline
      minRows={2}
      value={form.diagnosis}
      onChange={handleChange}
    />

    <TextField
      select
      label="Tipo de Diagnóstico"
      name="type_diagnosis"
      fullWidth
      value={form.type_diagnosis}
      onChange={handleChange}
    >
      <MenuItem value="true">Definitivo</MenuItem>
      <MenuItem value="false">Presuntivo</MenuItem>
    </TextField>

    <Autocomplete
      fullWidth
      options={JSON.parse(localStorage.getItem('icd10')) || []}
      getOptionLabel={(option) => `${option.code} - ${option.description}`}
      onChange={(e, newValue) =>
        setForm({ ...form, icd10_id: newValue ? newValue.id : '' })
      }
      renderInput={(params) => (
        <TextField {...params} label="Diagnóstico ICD10" />
      )}
    />

     <TextField
      label="Recomendaciones"
      name="recommendations"
      fullWidth
      multiline
      minRows={3}
      value={form.recommendations}
      onChange={handleChange}
    />
  </Stack>
          </Paper>
            <Grid container spacing={5} wrap = "wrap">
              
  


  {/* Diagnóstico ICD10 y recomendaciones */}
<Paper sx={{ padding: 3, marginTop: 3 }}>
 

 


  <Box textAlign="center">
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      Guardar Consulta
    </Button>
  </Box>
</Paper>


            


             
              
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default RegisterConsultation;
