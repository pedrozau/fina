import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../supabase/supabase'; // Ajuste o caminho conforme necessário

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    balance: 0,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError('Erro ao carregar usuário: ' + (userError?.message || 'Usuário não encontrado'));
        return;
      }

      const userId = userData.user.id;
      setUserId(userId);

      const { data: balanceData, error: balanceError } = await supabase
        .from('saldo_total')
        .select('saldo')
        .eq('user_id', userId)
        .single();

      if (balanceError) {
        setError('Erro ao carregar saldo: ' + balanceError.message);
        return;
      }

      setProfile({
        name: userData.user.user_metadata.name || '',
        email: userData.user.email || '',
        balance: balanceData ? balanceData.saldo : 0,
      });
    };

    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Atualizar saldo
      const { error: balanceError } = await supabase
        .from('saldo_total')
        .upsert({
          user_id: userId,
          saldo: profile.balance,
        });

      if (balanceError) throw balanceError;

      setIsEditing(false);
      setSuccess('Dados atualizados com sucesso!');
    } catch (error) {
      setError('Erro ao atualizar dados: ' + error.message);
    }
  };

  const handleCancelClick = () => {
    // Restaurar os dados ao estado inicial
    setProfile({
      ...profile,
      balance: 0, // Valor inicial do saldo, ajuste se necessário
    });

    setIsEditing(false);
  };

  const handleBalanceChange = (e) => {
    setProfile({
      ...profile,
      balance: Number(e.target.value), // Garante que o valor seja um número
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-transform duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center lg:hidden">
          <h1 className="text-2xl font-bold">Perfil</h1>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content */}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg mx-auto lg:mx-0">
            <h2 className="text-3xl font-semibold mb-6 text-center lg:text-left text-blue-700">Perfil do Usuário</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}
            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="name">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={profile.name}
                readOnly
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 bg-gray-100"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 bg-gray-100"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="balance">
                Saldo
              </label>
              <input
                id="balance"
                type="number"
                value={profile.balance}
                onChange={handleBalanceChange}
                readOnly={!isEditing}
                className={`shadow-sm border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-400' : 'bg-gray-100'}`}
              />
            </div>

            <div className="flex items-center justify-between">
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveClick}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <CheckIcon className="w-5 h-5 inline" /> Salvar
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <XMarkIcon className="w-5 h-5 inline" /> Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
