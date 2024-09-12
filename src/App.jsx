import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import ExpensePage from './pages/expense';
import DividasPage from './pages/dividas';
import PoupancaPage from './pages/poupanca';
import ProfilePage from './pages/profile';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // Importe o componente

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <PrivateRoute>
              <ExpensePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/divida"
          element={
            <PrivateRoute>
              <DividasPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/poupanca"
          element={
            <PrivateRoute>
              <PoupancaPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />

        {/* Rota de login aberta a todos */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
