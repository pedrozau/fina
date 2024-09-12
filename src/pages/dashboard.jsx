import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase'; // Importar o cliente Supabase
import Sidebar from '../components/sidebar';
import { MinusIcon } from '@heroicons/react/24/outline';
import ExpenseChart from '../components/exprenseChart';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [savings, setSavings] = useState(null);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [saldo, setsaldo] = useState(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user ID from the session
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Usuário não autenticado.');

        const userId = user.id;

        // Buscar saldo 
        const { data: saldoData, error: saldoError } = await supabase.from('saldo_total').select('*').eq('user_id', userId);
         
        setsaldo(saldoData[0]?.saldo || 0);
        
        // Buscar despesas totais
        let { data, error } = await supabase
          .from('despesa')
          .select('*')
          .eq('user_id', userId)
         
           setExpenseCategories(data) 
           

           

        
         

        if (error) throw error;
        setTotalExpenses(data.reduce((acc, row) => acc + row.valor, 0));

        // Buscar despesas mensais
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('despesa')
          .select('created_at, valor')
          .eq('user_id', userId);

        if (monthlyError) throw monthlyError;

        // Processar dados mensais
        const monthlyTotals = monthlyData.reduce((acc, { created_at, valor }) => {
          const month = new Date(created_at).toLocaleString('pt-AO', { month: 'long', year: 'numeric' });
          acc[month] = (acc[month] || 0) + valor;
          return acc;
        }, {});

        setMonthlyExpenses(Object.entries(monthlyTotals).map(([month, total]) => ({ month, total })));

      } catch (error) {
        console.error('Erro ao buscar dados:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 lg:ml-64">
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

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cards de Resumo */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Resumo Financeiro</h2>
              <p className="text-2xl font-bold text-green-600">
                {saldo ? ` ${saldo} Kz` : 'Carregando...'}
              </p>
              <p className="text-sm text-gray-500">Saldo total disponível</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Despesas Totais</h2>
              <p className="text-2xl font-bold text-red-600">
                {totalExpenses !== null ? ` ${totalExpenses} Kz` : 'Carregando...'}
              </p>
              <p className="text-sm text-gray-500">Despesas do mês atual</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Poupança</h2>
              <p className="text-2xl font-bold text-blue-600">
                {savings !== null ? `Kz ${savings}` : 'Carregando...'}
              </p>
              <p className="text-sm text-gray-500">Total em poupança</p>
            </div>

            {/* Gráficos e Outras Seções */}
            <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Gráfico de Despesas</h2>
                <ExpenseChart expenseData={expenseCategories}></ExpenseChart>
              {/* <div className="h-48 bg-gray-200 rounded-lg"></div> */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Categorias de Despesa</h2>
              <ul>
                {expenseCategories.length > 0 ? (
                  expenseCategories.map((category) => (
                    <li key={category.id} className="flex justify-between py-2 border-b border-gray-300">
                      <span>{category.categoria}</span>
                      <span>{category.valor ? ` ${category.valor} Kz` : 'Carregando...'}</span>
                    </li>
                  ))
                ) : (
                  <li className="py-2 text-gray-500">Carregando categorias...</li>
                )}
              </ul>
            </div>

            {/* Novo card para despesas mensais */}
            <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-3">
              <h2 className="text-lg font-semibold mb-4">Despesas Mensais</h2>
              <ul>
                {monthlyExpenses.map(({ month, total }) => (
                  <li key={month} className="flex justify-between py-2 border-b border-gray-300">
                    <span>{month}</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
