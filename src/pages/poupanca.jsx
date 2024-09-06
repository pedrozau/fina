import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import {
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const PoupancaPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-transform duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <header className="bg-green-600 text-white p-4 flex justify-between items-center lg:hidden">
          <h1 className="text-2xl font-bold">Dashboard de Finanças</h1>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <MinusIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content */}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">

          <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg mx-auto lg:mx-0">
          <h2 className="text-3xl font-semibold mb-6 text-center lg:text-left text-green-700">Gerenciar Poupança</h2>
            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="savingGoal">
                Meta de Poupança
              </label>
              <input
                id="savingGoal"
                type="text"
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-300 ease-in-out"
                placeholder="Ex: Fundo de Emergência"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="amount">
                Valor Inicial
              </label>
              <input
                id="amount"
                type="number"
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-300 ease-in-out"
                placeholder="Ex: 500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="monthlyContribution">
                Contribuição Mensal
              </label>
              <input
                id="monthlyContribution"
                type="number"
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-300 ease-in-out"
                placeholder="Ex: 100"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="dueDate">
                Data da Meta
              </label>
              <input
                id="dueDate"
                type="date"
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-300 ease-in-out"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-300 ease-in-out"
                placeholder="Escreva uma breve descrição..."
                rows="4"
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 w-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                Salvar Poupança
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PoupancaPage;
