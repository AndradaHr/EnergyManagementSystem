import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, userRole }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole !== 'ADMIN') {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
