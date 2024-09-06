import { motion } from 'framer-motion';
import ExpenseForm from '../components/expenseForm';
import Sidebar from '../components/sidebar';
import { MinusIcon } from '@heroicons/react/20/solid'; // Ajuste a importação se necessário
import { useState } from 'react';

const ExpensePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-transform duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center lg:hidden">
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
        
          
            <ExpenseForm />
    
        </div>
      </div>
    
  );
};

export default ExpensePage;
