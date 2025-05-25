import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import './GoalListStyle.css';

const API_BASE = 'http://localhost:8083/api/goals';

export default function GoalsList({ isSidebarOpen }) {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.jwt); 

  const [filter, setFilter] = useState('');
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTargetAmount, setNewGoalTargetAmount] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  const loadGoals = () => {
    setIsLoading(true);
    setIsError(false);
    const url = filter ? `${API_BASE}/?goalStatus=${filter}` : `${API_BASE}/`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setGoals(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadGoals();
  }, [filter]);

  const handleCreate = () => {
    if (!user || !user.id) return alert('User not logged in');
    if (!newGoalName.trim()) return alert('Name is required');
    if (!newGoalTargetAmount || Number(newGoalTargetAmount) <= 0) return alert('Amount should be positive');
    if (!newGoalDeadline) return alert('Please select a deadline date');

    fetch(`${API_BASE}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newGoalName.trim(),
        targetAmount: Number(newGoalTargetAmount),
        currentAmount: 0,
        deadline: newGoalDeadline,
        userId: user.id,
        status: 'IN_PROGRESS',
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create goal');
        return res.json();
      })
      .then(() => {
        setNewGoalName('');
        setNewGoalTargetAmount('');
        setNewGoalDeadline('');
        loadGoals();
      })
      .catch(() => alert('Error creating goal'));
  };

  const handleUpdate = () => {
    if (!user || !user.id) {
      alert('User not logged in');
      return;
    }

    if (!editingGoal) {
      alert('No goal selected for editing');
      return;
    }

    if (!editingGoal.name || !editingGoal.name.trim()) {
      alert('Name is required');
      return;
    }

    if (!editingGoal.targetAmount || Number(editingGoal.targetAmount) <= 0) {
      alert('Target amount should be positive');
      return;
    }

    if (editingGoal.currentAmount < 0) {
      alert('Current amount cannot be negative');
      return;
    }

    if (editingGoal.currentAmount > editingGoal.targetAmount) {
      alert('Current amount cannot be greater than target amount');
      return;
    }

    if (!editingGoal.deadline) {
      alert('Deadline is required');
      return;
    }

    if (!token) {
      return alert('User token missing, please login again.');
    }

    const updatedGoalData = {
      id: editingGoal.id,
      name: editingGoal.name.trim(),
      targetAmount: Number(editingGoal.targetAmount),
      currentAmount: Number(editingGoal.currentAmount),
      deadline: editingGoal.deadline ? editingGoal.deadline.slice(0, 10) : null,
      status: editingGoal.status,
      userId: user.id,
    };

    fetch(`${API_BASE}/update/${editingGoal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(updatedGoalData),
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => Promise.reject(err));
        return res.json();
      })
      .then(() => {
        setEditingGoal(null);
        loadGoals();
      })
      .catch(err => {
        console.error('Update error:', err);
        alert('Error updating goal: ' + (err.message || JSON.stringify(err)));
      });
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE}/delete/${id}`, { method: 'DELETE' })
      .then(() => loadGoals())
      .catch(() => alert('Error deleting goal'));
  };

  const handleCompleteGoal = (id) => {
    fetch(`${API_BASE}/${id}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => loadGoals())
      .catch(() => alert('Error completing goal'));
  };

  return (
    <div className={`goals-container ${isSidebarOpen ? 'shifted' : ''}`}>
      <h2 style={{ color: '#f05761', fontSize: '35px', fontWeight: 'bolder' }}>User Financial Goals</h2>

      <div className="filter-buttons">
        <button className={filter === '' ? 'active' : ''} onClick={() => setFilter('')}>All</button>
        <button className={filter === 'IN_PROGRESS' ? 'active' : ''} onClick={() => setFilter('IN_PROGRESS')}>In progress</button>
        <button className={filter === 'COMPLETED' ? 'active' : ''} onClick={() => setFilter('COMPLETED')}>Completed</button>
      </div>

      <div className="new-goal-form">
        <input type="text" placeholder="Name" value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)} />
        <input type="number" placeholder="Target amount" value={newGoalTargetAmount} onChange={(e) => setNewGoalTargetAmount(e.target.value)} min="1" />
        <input type="date" placeholder="Deadline" value={newGoalDeadline} onChange={(e) => setNewGoalDeadline(e.target.value)} />
        <button onClick={handleCreate}>Add</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading goals</p>
      ) : goals.length === 0 ? (
        <p>No goals yet</p>
      ) : (
        <table className="goals-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Target</th>
              <th>Current</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(goal =>
              editingGoal?.id === goal.id ? (
                <tr key={goal.id} className="editing">
                  <td><input type="text" value={editingGoal.name} onChange={e => setEditingGoal({ ...editingGoal, name: e.target.value })} /></td>
                  <td><input type="number" value={editingGoal.targetAmount} onChange={e => setEditingGoal({ ...editingGoal, targetAmount: Number(e.target.value) })} min={0} /></td>
                  <td><input type="number" value={editingGoal.currentAmount ?? 0} onChange={e => setEditingGoal({ ...editingGoal, currentAmount: Number(e.target.value) })} min={0} max={editingGoal.targetAmount} /></td>
                  <td><input type="date" value={editingGoal.deadline?.slice(0, 10)} onChange={e => setEditingGoal({ ...editingGoal, deadline: e.target.value })} /></td>
                  <td>{editingGoal.status}</td>
                  <td>
                    <button onClick={handleUpdate} title="Save">Save</button>
                    <button onClick={() => setEditingGoal(null)} title="Cancel">Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={goal.id} className={goal.status === 'COMPLETED' ? 'completed' : ''}>
                  <td>{goal.name}</td>
                  <td>{goal.targetAmount}</td>
                  <td>{goal.currentAmount ?? 0}</td>
                  <td>{goal.deadline}</td>
                  <td>{goal.status}</td>
                  <td>
                    {goal.status !== 'COMPLETED' && (
                      <button onClick={() => handleCompleteGoal(goal.id)} title="Complete"><FaCheck /></button>
                    )}
                    <button onClick={() => setEditingGoal({ ...goal })} title="Edit"><FaEdit /></button>
                    <button onClick={() => handleDelete(goal.id)} title="Delete"><FaTrash /></button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
