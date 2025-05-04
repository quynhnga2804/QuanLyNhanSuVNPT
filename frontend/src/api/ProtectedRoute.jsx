import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { user } = useContext(UserContext);
    const userRole = user.role?.toLowerCase();
    const normalizedRoles = allowedRoles.map(role => role.toLowerCase());

    if (!user) return <Navigate to="/login" replace />    

    if (normalizedRoles.includes(userRole))
        return element;
    return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;