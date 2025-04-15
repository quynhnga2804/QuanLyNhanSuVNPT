import React, { StrictMode, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AppUser from './AppUser.jsx';
import Login from './components/Login.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './api/UserContext.jsx';
import { ModalProvider } from './api/ModalContext.jsx';
import ProtectedRoute from './api/ProtectedRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ModalProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/admin/*" element={<ProtectedRoute element={<App />} allowedRoles={['Admin', 'Director', 'Manager', 'Accountant']} />} />

            <Route path="/user/*" element={<ProtectedRoute element={<AppUser />} allowedRoles={['Director', 'Manager', 'Accountant', 'Employee']} />} />

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/unauthorized" element={<h1>Bạn không có quyền truy cập trang này!!!</h1>} />
          </Routes>
        </Router>
      </ModalProvider>
    </UserProvider>
  </StrictMode>
);