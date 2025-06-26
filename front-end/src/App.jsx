import { useState } from 'react'
import LoginPage from './pages/loginpage';

function App() {
  const handleLogin = ({ user, pass }) => {
    console.log('Enviando credenciales →', user, pass);
    // Aquí llamas a tu API de autenticación
  };

  return (
    <LoginPage onSubmit={handleLogin} />
  )
}

export default App
