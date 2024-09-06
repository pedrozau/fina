// src/components/Sidebar.js
import React, { useState, useTransition } from 'react';
import { supabase } from '../supabase/supabase'; // Importa a configuração do Supabase
import {
  HomeIcon,
  CreditCardIcon,
  ChartPieIcon,
  CogIcon,
  MinusIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isPending, startTransition] = useTransition();

  const handleToggleSidebar = () => {
    startTransition(() => {
      toggleSidebar();
    });
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redireciona ou atualiza o estado após o logout
      window.location.href = '/login'; // Redireciona para a página de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-blue-700 text-white w-64 h-full z-50`}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Finanças</h2>
        <button
          onClick={handleToggleSidebar}
          className="lg:hidden text-white focus:outline-none"
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <MinusIcon className="w-6 h-6" />}
        </button>
      </div>

      <nav className="mt-8">
        <ul>
          <li>
            <a href="/" className="flex items-center p-4 hover:bg-blue-600">
              <HomeIcon className="w-6 h-6" />
              <span className="ml-3">Início</span>
            </a>
          </li>
          <li>
            <a href="/expense" className="flex items-center p-4 hover:bg-blue-600">
              <CreditCardIcon className="w-6 h-6" />
              <span className="ml-3">Despesas</span>
            </a>
          </li>
          {/* <li>
            <a href="#" className="flex items-center p-4 hover:bg-blue-600">
              <ChartPieIcon className="w-6 h-6" />
              <span className="ml-3">Relatórios</span>
            </a>
          </li> */}
          <li>
            <a href="/divida" className="flex items-center p-4 hover:bg-blue-600">
              <ExclamationTriangleIcon className="w-6 h-6" />
              <span className="ml-3">Dívidas</span>
            </a>
          </li>
          <li>
            <a href="/poupanca" className="flex items-center p-4 hover:bg-blue-600">
              <CurrencyDollarIcon className="w-6 h-6" />
              <span className="ml-3">Poupança</span>
            </a>
          </li>
          <li>
            <a href="/profile" className="flex items-center p-4 hover:bg-blue-600">
              <UserIcon className="w-6 h-6" />
              <span className="ml-3">Perfil de Usuário</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={handleLogout} className="flex items-center p-4 hover:bg-blue-600">
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              <span className="ml-3">Logout</span>
            </a>
          </li>
          {/* <li>
            <a href="#" className="flex items-center p-4 hover:bg-blue-600">
              <CogIcon className="w-6 h-6" />
              <span className="ml-3">Configurações</span>
            </a>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default React.memo(Sidebar);
