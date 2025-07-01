import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
    const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#eef2f7',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
      }}
    >
      <Typography variant="h4" gutterBottom>
        Panel de Opciones
      </Typography>
      <Stack spacing={2} width="300px">
        <Button 
            variant="contained" 
            color="primary"
              onClick={() => navigate('/consultation/new')}>Registrar Consulta Médica
        </Button>
        <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/create-patient')}>Registrar Paciente</Button>
        <Button 
            variant="contained" 
            color="primary"
             onClick={() => navigate('/medical-history')}>Buscar Historia Clínica</Button>
        <Button variant="contained" color="primary">Generar Receta</Button>
      </Stack>
    </Box>
  );
};

export default Dashboard;
