import React from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterConsultation from './pages/RegisterConsultation';
import RegisterPatient from './pages/RegisterPatient';
import MedicalHistory from './pages/MedicalHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/consultation/new" element={<RegisterConsultation />} />
        <Route path="/create-patient" element={<RegisterPatient />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
