import React, { StrictMode, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AppUser from './AppUser.jsx';
import Login from './components/Login.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './api/api.jsx';
import AdminHome from './pages/admin/AdminHome.jsx';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useContext(UserContext);

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin/*" element={<ProtectedRoute element={<App />} allowedRoles={['Admin', 'Director', 'Manager', 'Accountant']} />}>
            <Route index element={<ProtectedRoute element={<AdminHome />} allowedRoles={['Admin']} />} />
          </Route>

          <Route path="/user/*" element={<ProtectedRoute element={<AppUser />} allowedRoles={['Director', 'Manager', 'Accountant', 'Employee']} />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/unauthorized" element={<h1>Bạn không có quyền truy cập trang này!!!</h1>} />
        </Routes>
      </Router>
    </UserProvider>
  </StrictMode>
);