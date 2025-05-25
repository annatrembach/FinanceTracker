import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../store/AuthSlice';
import axios from 'axios';
import dayjs from 'dayjs';
import './UserProfileStyle.css';

const UserProfile = ({ isSidebarOpen }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [summary, setSummary] = useState({ balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return;

      try {
        const balanceRes = await axios.get(`http://localhost:8082/api/transactions/balance/${user.id}`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        setSummary(balanceRes.data);

        const txRes = await axios.get(`http://localhost:8082/api/transactions/user/${user.id}`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        setTransactions(txRes.data.reverse());
      } catch (err) {
        console.error('Error loading user data', err);
      }
    };

    fetchData();
  }, [user, jwt]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  return (
    <div className={`profile-container ${isSidebarOpen ? 'shifted' : ''}`}>
      <h2 className="profile-title">User Profile</h2>

      <div className="user-balance-wrapper">
        {user && (
          <div className="profile-info small-box">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}

        <div className="balance-text small-box">
          <span className="balance-label">Balance:</span><br/>
          <span className="balance-value">{summary.balance}$</span>
        </div>
      </div>

      <div className="transaction-history">
        <h3 className="section-title">Transaction History</h3>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul className="transaction-list">
            {transactions.map((tx) => (
              <li key={tx.id} className={`transaction-item ${tx.type}`}>
                <div className="left-group">
                  <span className="symbol">{tx.type === 'INCOME' ? '+' : '-'}</span>
                  <span className="amount">{tx.amount}$</span>
                  <span className="category">{tx.category?.name || 'No category'}</span>
                </div>
                <span className="date">{dayjs(tx.date).format('DD.MM.YYYY')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
