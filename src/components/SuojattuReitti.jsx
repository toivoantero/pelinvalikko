import React from 'react';
import { Navigate } from 'react-router-dom';

const SuojattuReitti = ({ children }) => {
  const onKirjautunut = !!localStorage.getItem('token'); // Simple authentication check

  if (!onKirjautunut) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default SuojattuReitti;
