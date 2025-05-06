// src/routes/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('token');

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
