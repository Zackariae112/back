import React from 'react';
import { Navigate } from 'react-router-dom';

const HomeRedirect = () => {
  const token = localStorage.getItem('token');
  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
};

export default HomeRedirect;
