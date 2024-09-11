import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabase'; // ajuste o caminho para seu cliente Supabase

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Função para verificar a sessão do usuário
    const getSession = async () => {
      const storedToken = localStorage.getItem('supabaseSession');
      if (storedToken) {
        // Recuperar a sessão usando o token armazenado
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
          navigate('/login');
        }
      } else {
        setUser(null);
        navigate('/login');
      }
    };

    getSession(); // Verificar a sessão no carregamento
     
    // Listener para eventos de autenticação (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        navigate('/login');
      }
    });

    return () => {
      listener.subscription.unsubscribe(); // Limpa o listener ao desmontar o componente
    };
  }, [navigate]);

  // Função de logout
  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    localStorage.removeItem('supabaseSession');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
