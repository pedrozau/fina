import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ajuste o caminho conforme necessário

const PrivateRoute = ({ children }) => {

    const  supabaseSession = localStorage.getItem('supabaseSession');
  // Se não há usuário logado, redirecionar para o login
  if (!supabaseSession) {
    return <Navigate to="/login" />;
  }

  // Caso contrário, renderiza a rota protegida
  return children;
};

export default PrivateRoute;
