import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPageStyle.css';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container mainpage-bg">
      <div className="mainpage-card">
        <h3 className="h3-main-page">Welcome to Finance Tracker</h3>
        <div className="summary">
          <div className="card">
            <p>Track</p>
            <span>your expenses</span>
          </div>
          <div className="card">
            <p>Plan</p>
            <span>your goals</span>
          </div>
          <div className="card">
            <p>Grow</p>
            <span>your savings</span>
          </div>
        </div>
        <div className="mainpage-buttons">
          <button className="main-btn" onClick={() => navigate('/login')}>Sign in</button>
          <button className="main-btn outline" onClick={() => navigate('/register')}>Sign up</button>
        </div>
      </div>
    </div>
  );
}
