import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Grid } from '@mui/material';
import './DashboardStyle.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = ({ isSidebarOpen }) => {
  const balance = 10000;
  const income = 3500;
  const expenses = 2000;

  const expenseCategories = {
    labels: ['Rent', 'Food', 'Utilities', 'Entertainment', 'Transport'],
    datasets: [
      {
        data: [500, 800, 300, 200, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF4384', '#35A2EB', '#FFAE56', '#5BC0C0', '#A966FF'],
      },
    ],
  };

  const incomeVsExpensesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Income',
        data: [3000, 3200, 3400, 3600, 3800, 4000, 4200],
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1,
      },
      {
        label: 'Expenses',
        data: [1500, 1600, 1800, 2000, 2100, 2200, 2300],
        fill: false,
        borderColor: '#FF6384',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'shifted' : ''}`}>
      <Grid container spacing={0} flex-wrap='wrap'>
        <Grid className="cards" container item style={{ width: '100%' }} justifyContent="center" alignItems="center">
          <Grid item xs={4}>
            <div className="card">
              <h3>Total Balance</h3>
              <p>${balance}</p>
            </div>
          </Grid>
    
          <Grid item xs={4}>
            <div className="card">
              <h3>Income</h3>
              <p>${income}</p>
            </div>
          </Grid>
    
          <Grid item xs={4}>
            <div className="card">
              <h3>Expenses</h3>
              <p>${expenses}</p>
            </div>
          </Grid>
        </Grid>
    
        <Grid className="charts" container item style={{ width: '100%' }} justifyContent="center" alignItems="center"> 
          <Grid item xs={4}>
            <div className="chart-round">
              <h3>Expenses by Category</h3>
              <Pie className='canvas' data={expenseCategories} />
            </div>
          </Grid>
    
          <Grid item xs={8}>
            <div className="chart-line">
              <h3>Income vs Expenses</h3>
              <Line data={incomeVsExpensesData} />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
