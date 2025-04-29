import React, { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AppUser from './AppUser.jsx';
import Login from './components/Login.jsx';
import { UserProvider } from './api/UserContext.jsx';
import { ModalProvider } from './api/ModalContext.jsx';
import ProtectedRoute from './api/ProtectedRoute.jsx';
import Error403 from './components/Error403';
import Error404 from './components/Error404';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ModalProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/admin/*" element={<ProtectedRoute element={<App />} allowedRoles={['Admin', 'Director', 'Manager', 'Accountant', 'hr']} />} />

            <Route path="/user/*" element={<ProtectedRoute element={<AppUser />} allowedRoles={['Director', 'Manager', 'Accountant', 'Employee', 'hr']} />} />

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/unauthorized" element={<Error403 />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </ModalProvider>
    </UserProvider>
  </StrictMode>
);