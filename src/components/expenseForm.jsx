import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import Alert from '../components/alert'; // Importe o componente Alert

const ExpenseForm = () => {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao obter sessão:', error.message);
        return;
      }
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    fetchUserId();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!expenseName) newErrors.expenseName = 'Nome da despesa é obrigatório';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Valor deve ser maior que 0';
    if (!date) newErrors.date = 'Data é obrigatória';
    else if (new Date(date) > new Date()) newErrors.date = 'Data não pode ser futura';
    if (!category) newErrors.category = 'Categoria é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setAlertMessage('');
    setAlertType('');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setAlertMessage('Usuário não autenticado. Por favor, faça login novamente.');
      setAlertType('error');
      setIsLoading(false);
      return;
    }

    if (validateForm()) {
      try {
        // Buscar o saldo atual
        const { data: saldoData, error: saldoError } = await supabase
          .from('saldo_total')
          .select('saldo')
          .eq('user_id', userId)
          .single();

        if (saldoError) throw saldoError;

        const saldoAtual = saldoData.saldo;
        const despesaValor = parseFloat(amount);

        if (despesaValor > saldoAtual) {
          setAlertMessage('Saldo insuficiente para essa despesa.');
          setAlertType('error');
          setIsLoading(false);
          return;
        }

        const novoSaldo = saldoAtual - despesaValor;

        // Inserir a nova despesa
        const { error: insertError } = await supabase
          .from('despesa')
          .insert({
            nome: expenseName,
            valor: despesaValor,
            user_id: userId,
            data: date,
            categoria: category,
          });

        if (insertError) throw insertError;

        // Atualizar o saldo total
        const { data, error: updateError } = await supabase
          .from('saldo_total')
          .update({ saldo: novoSaldo })
          .match({ user_id: session.user.id });

        if (updateError) {
          console.error('Erro ao atualizar saldo:', updateError);
          throw updateError;
        }

        setAlertMessage('Despesa adicionada com sucesso! Saldo atualizado.');
        setAlertType('success');
        resetForm();
      } catch (error) {
        console.error('Erro ao adicionar despesa:', error.message);
        setAlertMessage('Erro ao adicionar despesa. Tente novamente mais tarde.');
        setAlertType('error');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setExpenseName('');
    setAmount('');
    setDate('');
    setCategory('');
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Adicionar Despesa</h2>
        {alertMessage && <Alert message={alertMessage} type={alertType} />}
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <p className="text-red-500 text-xs italic mb-4">{errors.form}</p>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expenseName">
              Nome da Despesa
            </label>
            <input
              type="text"
              id="expenseName"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              placeholder="Digite o nome da despesa"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.expenseName ? 'border-red-500' : ''}`}
              aria-describedby="expenseNameError"
              aria-invalid={!!errors.expenseName}
            />
            {errors.expenseName && (
              <p id="expenseNameError" className="text-red-500 text-xs italic">{errors.expenseName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Valor
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Digite o valor"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.amount ? 'border-red-500' : ''}`}
              aria-describedby="amountError"
              aria-invalid={!!errors.amount}
            />
            {errors.amount && (
              <p id="amountError" className="text-red-500 text-xs italic">{errors.amount}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Data
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.date ? 'border-red-500' : ''}`}
              aria-describedby="dateError"
              aria-invalid={!!errors.date}
            />
            {errors.date && (
              <p id="dateError" className="text-red-500 text-xs italic">{errors.date}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.category ? 'border-red-500' : ''}`}
              aria-describedby="categoryError"
              aria-invalid={!!errors.category}
            >
              <option value="">Selecione uma categoria</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Lazer">Lazer</option>
              <option value="Saúde">Saúde</option>
              <option value="Namorada">Namorada</option>
              <option value="Familia">Familia</option>
              <option value="Equipamente">Equipamente</option>
              <option value="Outros">Outros</option>
              
            </select>
            {errors.category && (
              <p id="categoryError" className="text-red-500 text-xs italic">{errors.category}</p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <motion.button
              type="submit"
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </motion.button>
          </div>
          {successMessage && (
            <p className="text-green-500 text-xs italic mt-4">{successMessage}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ExpenseForm;
