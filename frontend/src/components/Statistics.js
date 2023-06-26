import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend,  CategoryScale, LinearScale, PointElement,
  LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement,
  Title,Tooltip, Legend);

function Statistics({token}) {
  const [pieChart, setPieChart] = useState({});
  const [lineChartE, setLineChartE] = useState({});
  const [lineChartI, setLineChartI] = useState({});
  const [categoryDistribution, setCategoryDistribution] = useState('All');
  const [expenseDistribution, setExpenseDistribution] = useState(3);
  const [incomeDistribution, setIncomeDistribution] = useState(3);
  const [loadingPie, setLoadingPie] = useState(true);
  const [loadingLineE, setLoadingLineE] = useState(true);
  const [loadingLineI, setLoadingLineI] = useState(true);

  useEffect(() => {
    fetchCategoryDistribution();
  }, [categoryDistribution]);

  useEffect(() => {
    fetchTransactionDistribution("Expense");
  }, [expenseDistribution]);

  useEffect(() => {
    fetchTransactionDistribution("Income");
  }, [incomeDistribution]);

  const handleCategoryDistributionChange = (event) => {
    setCategoryDistribution(event.target.value);
  };

  const handleExpenseDistributionChange = (event) => {
    setExpenseDistribution(event.target.value);
  };

  const handleIncomeDistributionChange = (event) => {
    setIncomeDistribution(event.target.value);
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)' 
        },
      },
    }
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)' 
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        },
      },
    },
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const fetchCategoryDistribution = () => {
    axios.get('http://127.0.0.1:8000/api/transactions/get_categories_distribution/', 
      {
        params: {
          option: categoryDistribution 
        },
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        const labels = response.data.categories;
        const amounts = response.data.expenses;
        const colors = [];
        for (let i = 0; i < response.data.categories.length; i++) {
          colors.push(getRandomColor());
        }
        const data = {
          labels: labels,
          datasets: [
            {
              label: "total",
              data: amounts,
              backgroundColor: colors,
            },
          ],
        };
        setPieChart(data);
        setLoadingPie(false);
      });
  };

  const fetchTransactionDistribution = (tr_type) => {
    const months = tr_type === "Expense" ? expenseDistribution : incomeDistribution;
    axios.get('http://127.0.0.1:8000/api/transactions/get_transactions_distribution/', 
      {
        params: {
          months: months,
          tr_type: tr_type
        },
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        const labels = response.data.months;
        const amounts = response.data.amounts;
        const data = {
          labels: labels,
          datasets: [
            {
              label: tr_type,
              data: amounts,
              borderColor: tr_type === "Expense" ? 'rgb(255, 0, 0)' : 'rgb(0, 255, 0)',
              tension: 0.1
            },
          ]
        };
        if (tr_type === "Expense") {
          setLineChartE(data);
          setLoadingLineE(false);
        } else {
          setLineChartI(data);
          setLoadingLineI(false);
        }
      });
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <h2 className='text-center'>Expenses' Categories Distribution</h2>
              <div className='text-end'>
                <select value={categoryDistribution} onChange={handleCategoryDistributionChange}>
                  <option value="All">All</option>
                  <option value="CurrentMonth">Current Month</option>
                  <option value="CurrentYear">Current Year</option>
                </select>
              </div> 
        <div className="chart-container" style={{ height: '40vh'}}>    
          {!loadingPie && <Pie data={pieChart} options={pieOptions}/>}
        </div>
      </div>
      <div className="col-md-4">
        <h2 className='text-center'>Expenses' Distribution</h2>
        <div className='text-end'>
          <select value={expenseDistribution} onChange={handleExpenseDistributionChange}>
            <option value="3">Past 3 Months</option>
            <option value="6">Past 6 Months</option>
            <option value="12">Past Year</option>
          </select>
        </div>         
        <div className="chart-container" style={{ height: '40vh'}}> 
          {!loadingLineE && <Line data={lineChartE} options={lineOptions}/>}
        </div>
       </div>
       <div className="col-md-4">
        <h2 className='text-center'>Incomes' Distribution</h2>
        <div className='text-end'>
          <select value={incomeDistribution} onChange={handleIncomeDistributionChange}>
            <option value="3">Past 3 Months</option>
            <option value="6">Past 6 Months</option>
            <option value="12">Past Year</option>
          </select>
        </div>    
        <div className="chart-container" style={{ height: '40vh'}}>  
          {!loadingLineI && <Line data={lineChartI} options={lineOptions}/>}
        </div>
       </div>
    </div>
  );
}

export default Statistics;
