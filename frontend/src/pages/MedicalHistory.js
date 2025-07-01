import React, { useEffect, useState } from 'react';
import { Box, Button, Autocomplete, TextField, Typography, Paper, List, ListItem, ListItemText, Alert } from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MedicalHistory = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [message, setMessage] = useState({ text: '', severity: '' });

  // Cargar pacientes al iniciar
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/patients/all`);
        setPatients(response.data.patients);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
        setMessage({ text: 'Error al cargar pacientes', severity: 'error' });
      }
    };

    fetchPatients();
  }, []);

  // Función para descargar el PDF
 const handleDownloadPDF = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');

  // Definir el tamaño de la fuente para el título
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);

  // Título
  pdf.text('Historia Clínica', 14, 20);

  // Espacio después del título
  pdf.setFontSize(12);

  // Información del paciente (parte superior)
  pdf.text(`Paciente: ${selectedPatient.first_name} ${selectedPatient.last_name}`, 14, 30);
  pdf.text(`Cédula: ${selectedPatient.document_number}`, 14, 36);
  pdf.text(`Fecha de Nacimiento: ${new Date(selectedPatient.birth_date).toLocaleDateString()}`, 14, 42);
  pdf.text(`Género: ${selectedPatient.gender}`, 14, 48);
  pdf.text(`Teléfono: ${selectedPatient.phone || 'N/A'}`, 14, 54);
  pdf.text(`Dirección: ${selectedPatient.address || 'N/A'}`, 14, 60);
  pdf.text(`Tipo de Sangre: ${selectedPatient.blood_type || 'N/A'}`, 14, 66);

  // Salto de línea para separar la información del paciente de las consultas
  pdf.line(10, 70, 200, 70);  // Línea divisoria
  pdf.text('Consultas Médicas:', 14, 75);

  // Ajustar el espacio de las consultas
  let yPosition = 80;

  // Datos de las consultas
  consultations.forEach((c) => {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Fecha: ${new Date(c.date).toLocaleDateString()}`, 14, yPosition);
    yPosition += 6;
    pdf.text(`Motivo: ${c.reason}`, 14, yPosition);
    yPosition += 6;
    pdf.text(`Diagnóstico: ${c.diagnosis || 'No especificado'}`, 14, yPosition);
    yPosition += 6;
    pdf.text(`Tipo de Diagnóstico: ${c.type_diagnosis === 'true' ? 'Definitivo' : 'Presuntivo'}`, 14, yPosition);
    yPosition += 6;
    pdf.text(`Código ICD10: ${c.icd10_code} - ${c.icd10_description}`, 14, yPosition);
    yPosition += 6;
    pdf.text(`Recomendaciones: ${c.recommendations || 'Ninguna'}`, 14, yPosition);
    yPosition += 12;  // Agregar un espacio entre consultas
  });

  // Guardar el archivo PDF
  pdf.save(`historia_${selectedPatient.first_name}_${selectedPatient.last_name}.pdf`);
};

  // Buscar historial médico
  const handleSearch = async () => {
    setMessage({ text: '', severity: '' });

    if (!selectedPatient) {
      setMessage({ text: 'Seleccione un paciente', severity: 'warning' });
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/consultations/history`, {
        params: { patient_id: selectedPatient.id }
      });
      setConsultations(response.data.consultations);
    } catch (error) {
      console.error('Error al buscar historial:', error);
      setMessage({ text: 'No se encontraron consultas o hubo un error', severity: 'error' });
      setConsultations([]);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>Buscar Historia Clínica</Typography>

      {/* Mostrar mensaje de error o éxito */}
      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {/* Fila con Autocomplete y Botón */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
        <Autocomplete
          options={patients}
          getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
          renderInput={(params) => <TextField {...params} label="Seleccione un paciente" fullWidth />}
          value={selectedPatient}
          onChange={(event, newValue) => setSelectedPatient(newValue)}
          sx={{ width: '100%' }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Buscar
        </Button>
      </Box>

      {/* Mostrar resultados */}
      {consultations.length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleDownloadPDF}>
              Descargar PDF
            </Button>
          </Box>

          <Paper sx={{ p: 3 }} id="history-pdf">
            <Typography variant="h6" gutterBottom>
              Historial de {selectedPatient?.first_name} {selectedPatient?.last_name}
            </Typography>
            <List>
              {consultations.map((c, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`${new Date(c.date).toLocaleDateString()} - ${c.reason}`}
                    secondary={
                      <>
                        <div><strong>Diagnóstico:</strong> {c.diagnosis || 'No especificado'}</div>
                        <div><strong>Tipo:</strong> {c.type_diagnosis === 'true' ? 'Definitivo' : 'Presuntivo'}</div>
                        <div><strong>Código ICD10:</strong> {c.icd10_code} - {c.icd10_description}</div>
                        <div><strong>Recomendaciones:</strong> {c.recommendations || 'Ninguna'}</div>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default MedicalHistory;
