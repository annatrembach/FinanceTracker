import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Grid } from '@mui/material';
import './DashboardStyle.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = ({ isSidebarOpen }) => {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 });
  const [expenseCategoriesData, setExpenseCategoriesData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }]
  });
  const [incomeVsExpensesData, setIncomeVsExpensesData] = useState({
    labels: [],
    datasets: []
  });

  const jwt = localStorage.getItem("jwt");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!user || !user.id) return;

        const response = await axios.get(`http://localhost:8082/api/transactions/balance/${user.id}`, {
          headers: { Authorization: `Bearer ${jwt}`, Accept: "application/json" }
        });
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching dashboard summary", error);
      }
    };

    fetchSummary();
  }, [jwt, user]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user || !user.id) return;

      try {
        const response = await axios.get(`http://localhost:8082/api/transactions/filter`, {
          headers: { Authorization: `Bearer ${jwt}`, Accept: "application/json" },
          params: { type: "expense" }
        });

        const transactions = response.data;

        const categorySums = {};
        transactions.forEach(t => {
          const cat = t.category.name;
          categorySums[cat] = (categorySums[cat] || 0) + t.amount;
        });

        const labels = Object.keys(categorySums);
        const data = Object.values(categorySums);

        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];
        const backgroundColor = labels.map((_, i) => colors[i % colors.length]);
        const hoverBackgroundColor = labels.map((_, i) => colors[i % colors.length].replace(')', ', 0.7)').replace('rgb', 'rgba'));

        setExpenseCategoriesData({
          labels,
          datasets: [
            {
              data,
              backgroundColor,
              hoverBackgroundColor,
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching expense categories data", error);
      }
    };

    fetchExpenses();
  }, [jwt, user]);

  // Новий useEffect для динамічного line chart з даних filter
  useEffect(() => {
  const fetchMonthlySummary = async () => {
    if (!user || !user.id) return;

    try {
      const response = await axios.get(`http://localhost:8082/api/transactions/monthly-summary/${user.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json"
        }
      });

      const summaryData = response.data;

      // Місяці у форматі "Jan", "Feb", ..., "Dec"
      const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      // Map DTO -> { month, income, expense }
      const monthMap = {};
      summaryData.forEach(item => {
        const month = item.month;
        monthMap[month] = item;
      });

      const allMonths = Object.keys(monthMap).sort(
        (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
      );

      const incomeData = allMonths.map(month => monthMap[month]?.income || 0);
      const expenseData = allMonths.map(month => monthMap[month]?.expense || 0);

      setIncomeVsExpensesData({
        labels: allMonths,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            fill: false,
            borderColor: '#36A2EB',
            tension: 0.1,
          },
          {
            label: 'Expenses',
            data: expenseData,
            fill: false,
            borderColor: '#FF6384',
            tension: 0.1,
          },
        ],
      });

    } catch (error) {
      console.error("Error fetching monthly summary", error);
    }
  };

  fetchMonthlySummary();
}, [jwt, user]);

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'shifted' : ''}`}>
      <Grid container spacing={0} flex-wrap='wrap'>
        <Grid className="cards" container item style={{ width: '100%' }} justifyContent="center" alignItems="center">
          <Grid item xs={4}>
            <div className="card">
              <h3 className='h3-dashboard'>Total Balance</h3>
              <p>${summary.balance}</p>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className="card">
              <h3 className='h3-dashboard'>Income</h3>
              <p>${summary.income}</p>
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className="card">
              <h3 className='h3-dashboard'>Expenses</h3>
              <p>${summary.expenses}</p>
            </div>
          </Grid>
        </Grid>

        <Grid className="charts" container item style={{ width: '100%' }} justifyContent="center" alignItems="center"> 
          <Grid item xs={4}>
            <div className="chart-round">
              <h3 className='h3-dashboard'>Expenses by Category</h3>
              <Pie className='canvas' data={expenseCategoriesData} />
            </div>
          </Grid>

          <Grid item xs={8}>
            <div className="chart-line">
              <h3 className='h3-dashboard'>Income vs Expenses</h3>
              <Line data={incomeVsExpensesData} />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
