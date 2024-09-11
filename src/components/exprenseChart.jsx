import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseChart = ({ expenseData }) => {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    updateChartData();
  }, [expenseData, selectedMonth]);

  const updateChartData = () => {
    let filteredData = expenseData;
    if (selectedMonth !== 'all') {
      filteredData = expenseData.filter(item => {
        const itemDate = new Date(item.data);
        return itemDate.getMonth() === parseInt(selectedMonth);
      });
    }

    const categories = filteredData.map(item => item.categoria);
    const values = filteredData.map(item => item.valor);

    setChartData({
      labels: categories,
      datasets: [
        {
          label: 'Despesas por Categoria',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
      ],
    });
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

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="month-select" className="mr-2">Selecione o mês:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border rounded p-1"
        >
          <option value="all">Todos os meses</option>
          <option value="0">Janeiro</option>
          <option value="1">Fevereiro</option>
          <option value="2">Março</option>
          <option value="3">Abril</option>
          <option value="4">Maio</option>
          <option value="5">Junho</option>
          <option value="6">Julho</option>
          <option value="7">Agosto</option>
          <option value="8">Setembro</option>
          <option value="9">Outubro</option>
          <option value="10">Novembro</option>
          <option value="11">Dezembro</option>
        </select>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ExpenseChart;
