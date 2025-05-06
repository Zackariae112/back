import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  try {
    if (!token) {
      console.log("🔒 No token found in localStorage");
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const isValid = exp * 1000 > Date.now();

    console.log("🔐 Token valid:", isValid, "| Exp:", new Date(exp * 1000));
    return isValid;
  } catch (err) {
    console.error("❌ Token parsing failed:", err);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const auth = isAuthenticated();

  console.log("🛡️ ProtectedRoute check:", auth, "for", location.pathname);

  if (!auth) {
    console.warn("⛔ Not authenticated → redirecting to /login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
