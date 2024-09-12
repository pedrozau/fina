// src/components/Sidebar.js
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

const menuItems = [
  { href: '/', icon: HomeIcon, label: 'Início' },
  { href: '/expense', icon: CreditCardIcon, label: 'Despesas' },
  { href: '/divida', icon: ExclamationTriangleIcon, label: 'Dívidas' },
  { href: '/poupanca', icon: CurrencyDollarIcon, label: 'Poupança' },
  { href: '/profile', icon: UserIcon, label: 'Perfil de Usuário' },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} passHref>
                <a className={`flex items-center p-4 hover:bg-blue-600 ${
                  router.pathname === item.href ? 'bg-blue-800' : ''
                }`}>
                  <item.icon className="w-6 h-6" />
                  <span className="ml-3">{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
          <li>
            <a href="#" onClick={handleLogout} className="flex items-center p-4 hover:bg-blue-600">
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              <span className="ml-3">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default React.memo(Sidebar);
