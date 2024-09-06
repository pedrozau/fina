import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '../supabase/supabase'; // Importar o cliente Supabase

const ExpenseForm = () => {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!expenseName) newErrors.expenseName = 'Nome da despesa é obrigatório';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Valor deve ser maior que 0';
    if (!date) newErrors.date = 'Data é obrigatória';
    if (!category) newErrors.category = 'Categoria é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('Usuário não autenticado');
      return;
    }

    if (validateForm()) {
      try {
        // Buscar o saldo atual da tabela saldo_total
        const { data: saldoData, error: saldoError } = await supabase
          .from('saldo_total')
          .select('saldo')
          .eq('user_id', user.id)
          .single();

          console.log(user.id)

        if (saldoError) throw saldoError;

        const saldoAtual = saldoData.saldo;

        // Verifica se o saldo é suficiente
        if (parseFloat(amount) > saldoAtual) {
          setErrors({ form: 'Saldo insuficiente para essa despesa.' });
          return;
        }

        // Atualizar o saldo total subtraindo o valor da despesa
        const novoSaldo = saldoAtual - parseFloat(amount);
        
        const { error: updateError } = await supabase
          .from('saldo_total')
          .update({ saldo: novoSaldo })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        // Adicionar a despesa ao Supabase
        const { data, error: insertError } = await supabase
          .from('despesa')
          .insert([
            {
              nome: expenseName,
              valor: parseFloat(amount),
              user_id: user.id,
              data: date,
              categoria: category,
            },
          ]);

        if (insertError) throw insertError;

        setSuccessMessage('Despesa adicionada com sucesso! Saldo atualizado.');
        // Resetar o formulário e erros
        setExpenseName('');
        setAmount('');
        setDate('');
        setCategory('');
        setErrors({});
      } catch (error) {
        console.error('Erro ao adicionar despesa:', error.message);
        setErrors({ form: 'Erro ao adicionar despesa. Tente novamente mais tarde.' });
      }
    }
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
            >
              <option value="">Selecione uma categoria</option>
              <option value="alimentacao">Alimentação</option>
              <option value="transporte">Transporte</option>
              <option value="lazer">Lazer</option>
              <option value="saude">Saúde</option>
            </select>
            {errors.category && (
              <p id="categoryError" className="text-red-500 text-xs italic">{errors.category}</p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <motion.button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Adicionar
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
