import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaAdmin = ({ children }) => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'admin') {
        return <Navigate to="/dashboard" />; 
    }

    return children;
};

export default RutaAdmin;