import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseChart = ({ expenseData }) => {
  // Extrair categorias e valores dos dados de despesa
  const categories = expenseData.map(item => item.categoria); // Usando o nome da despesa como categoria
  const values = expenseData.map(item => item.valor); // Usando o valor da despesa

  // Dados para o gráfico (baseado nas categorias e valores das despesas)
  const data = {
    labels: categories, // Categorias de despesa (nome)
    datasets: [
      {
        label: 'Despesas por Nome',
        data: values, // Valores das despesas
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Cor das barras
        borderColor: 'rgba(75, 192, 192, 1)', // Cor da borda
        borderWidth: 2, // Espessura da borda
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Despesas',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ExpenseChart;
