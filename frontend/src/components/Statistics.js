import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Statistics({token}) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPercentages();
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const fetchPercentages = () => {
    axios.get('http://127.0.0.1:8000/api/transactions/get_expense_amounts/', 
      {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        const labels = response.data.map(expense => expense.category);
        const amounts = response.data.map(expense => expense.total_amount);
        const colors = [];
        for (let i = 0; i < response.data.length; i++) {
          colors.push(getRandomColor());
        }
  
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "total",
              data: amounts,
              backgroundColor: colors,
            },
          ],
        };

        console.log(chartData);
  
        setChartData(chartData);
        setLoading(false);
      });
  };
  

  return (
    <div className="chart-container" style={{ height: '50vh' }}>
      <h2 className='text-center'>Expenses Categories</h2>
      {!loading && <Pie data={chartData} options={{ maintainAspectRatio: false }}/>}
    </div>
  );
}

export default Statistics;
