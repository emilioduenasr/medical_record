import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState({ text: '', severity: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', severity: '' });

    console.log('📤 Enviando datos de login:');

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);

      if (response.status === 200) {
        console.log('✅ Login exitoso:', response.data);
        setMessage({ text: 'Login exitoso', severity: 'success' });
        navigate('/dashboard');


        // Guardar token si viene en la respuesta
        // localStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      if (error.response) {
        console.error('⚠️ Error en respuesta:', error.response.status, error.response.data);

        const { status } = error.response;
        if (status === 400) {
          setMessage({ text: 'Usuario o contraseña incorrectos', severity: 'warning' });
        } else if (status === 500) {
          setMessage({ text: 'Error en el servidor. Intente más tarde.', severity: 'error' });
        } else {
          setMessage({ text: 'Error inesperado', severity: 'error' });
        }
      } else {
        console.error('❌ Error de red o conexión:', error.message);
        setMessage({ text: 'No se pudo conectar con el servidor', severity: 'error' });
      }
    }
  };

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        {message.text && (
          <Alert severity={message.severity} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            name="username"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
             onClick={handleSubmit}  
          >
            Entrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
