
import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import './loginpage.css';

export default function LoginPage({ onSubmit }) {
  const [creds, setCreds] = useState({ user: '', pass: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setCreds(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(creds);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        <div className="input-group">
          <label htmlFor="user">Usuario</label>
          <Input
            id="user"
            name="user"
            value={creds.user}
            onChange={handleChange}
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div className="input-group">
          <label htmlFor="pass">Contraseña</label>
          <Input
            id="pass"
            name="pass"
            type="password"
            value={creds.pass}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <Button primary type="submit">
          Entrar
        </Button>
      </form>
    </div>
  );
}
