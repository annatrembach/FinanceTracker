import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { restoreUser } from './store/AuthSlice';

import Dashboard from './components/Dashboard/Dashboard.jsx';
import Header from './components/Header/Header.jsx';
import RegistrationForm from './components/Forms/Registration/RegistrationForm.jsx';
import LoginForm from './components/Forms/Login/LoginForm.jsx';
import UserProfile from './pages/UserProfile/UserProfile.jsx';
import GoalList from './pages/GoalList/GoalList.jsx';
import TransactionList from './pages/TransactionList/TransactionList.jsx'
import MainPage from './pages/MainPage/MainPage.jsx';


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const userStr = localStorage.getItem('user');

    if (jwt && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(restoreUser({ jwt, user }));
      } catch (e) {
        console.error('Invalid user in localStorage:', e);
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <>
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <Dashboard isSidebarOpen={isSidebarOpen} />
              </>
            }
          />
          <Route path="/profile" element={
              <>
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <UserProfile isSidebarOpen={isSidebarOpen} />
              </>
            } 
          />
          <Route
            path="/goals"
            element={
              <>
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <GoalList isSidebarOpen={isSidebarOpen} />
              </>
            }
          />
          <Route
            path="/transactions"
            element={
              <>
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                <TransactionList isSidebarOpen={isSidebarOpen} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
