import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './TransactionListStyle.css';

const API_BASE = 'http://localhost:8082/api/transactions';
const CATEGORY_API = 'http://localhost:8082/api/categories';
const GOALS_API = 'http://localhost:8083/api/goals/';

function CustomSelectWithInput({ options, value, onChange, placeholder, readOnlyInput = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const ref = useRef();

  useEffect(() => {
    if (value === '') {
      setInputValue('');
    } else if (typeof value === 'string' || typeof value === 'number') {
      const option = options.find(o => o.value === value);
      setInputValue(option ? option.label : value || '');
    } else {
      setInputValue('');
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        if (!readOnlyInput) {
          const matchedOption = options.find(
            o => o.label.toLowerCase() === inputValue.toLowerCase()
          );
          if (matchedOption) {
            onChange(matchedOption.value);
          } else {
            onChange(inputValue.trim());
          }
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue, onChange, readOnlyInput, options]);

  const searchText = inputValue.toLowerCase();
  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(searchText)
  );

  return (
    <div ref={ref} className="custom-select-with-input">
      <input
        type="text"
        className="custom-select-input"
        value={inputValue}
        placeholder={placeholder}
        onChange={e => {
          if (!readOnlyInput) {
            setInputValue(e.target.value);
            setIsOpen(true);
            onChange(e.target.value === '' ? '' : e.target.value);
          }
        }}
        onFocus={() => setIsOpen(true)}
        readOnly={readOnlyInput}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="custom-select-input-options">
          {filteredOptions.map(o => (
            <li
              key={o.value}
              className="custom-select-option"
              onClick={() => {
                onChange(o.value);
                setInputValue(o.label);
                setIsOpen(false);
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TransactionList({ isSidebarOpen }) {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.jwt);

  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);

  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newGoalInput, setNewGoalInput] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');

  const [editingTransaction, setEditingTransaction] = useState(null);

  const loadTransactions = () => {
    if (!user?.id) return;

    const query = new URLSearchParams();

    if (filterType && filterType !== '') query.append('type', filterType);
    if (filterCategory && filterCategory !== '') query.append('category', filterCategory);

    fetch(`${API_BASE}/filter?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(() => alert('Failed to load transactions'));
  };

  const loadCategories = () => {
    fetch(CATEGORY_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  const loadGoals = () => {
    fetch(GOALS_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setGoals(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => {
    loadTransactions();
    loadCategories();
    loadGoals();
  }, [filterType, filterCategory, user?.id]);

  const handleAddTransaction = () => {
    if (!user?.id) return alert('User not logged in');
    if (!newAmount || newAmount <= 0) return alert('Enter valid amount');
    if (!newCategoryInput || !newCategoryInput.toString().trim())
      return alert('Please enter or select a category');
    if (!['INCOME', 'EXPENSE'].includes(newType.toUpperCase()))
      return alert('Invalid type');

    const existingCategory =
      typeof newCategoryInput === 'string' && isNaN(newCategoryInput)
        ? categories.find(
            c => c.name.toLowerCase() === newCategoryInput.trim().toLowerCase()
          )
        : categories.find(c => c.id.toString() === newCategoryInput.toString());

    const createCategoryIfNeeded = existingCategory
      ? Promise.resolve(existingCategory)
      : fetch(CATEGORY_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newCategoryInput.trim() }),
        }).then(res => {
          if (!res.ok) throw new Error('Failed to create category');
          return res.json();
        });

    createCategoryIfNeeded
      .then(category => {
        return fetch(`${API_BASE}/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(newAmount),
            type: newType.toUpperCase(),
            description: newDescription,
            transactionDate: newDate,
            userId: user.id,
            category: { id: category.id },
            goalId: newGoalInput || null,
          }),
        });
      })
      .then(() => {
        setNewAmount('');
        setNewType('');
        setNewCategoryInput('');
        setNewGoalInput('');
        setNewDescription('');
        setNewDate('');
        loadTransactions();
        loadCategories();
        loadGoals();
      })
      .catch(err => alert(err.message || 'Failed to add transaction'));
  };

  const handleDeleteTransaction = id => {
    fetch(`${API_BASE}/delete/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => loadTransactions())
      .catch(() => alert('Failed to delete transaction'));
  };

  const handleUpdateTransaction = () => {
    if (!editingTransaction || editingTransaction.amount <= 0) {
      return alert('Amount must be positive');
    }

    fetch(`${API_BASE}/update/${editingTransaction.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        description: editingTransaction.description,
        transactionDate: editingTransaction.transactionDate,
        userId: user.id,
        category: editingTransaction.category
          ? { id: editingTransaction.category }
          : null,
        goalId: editingTransaction.goal || null,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setEditingTransaction(null);
        loadTransactions();
      })
      .catch(() => alert('Failed to update transaction'));
  };

  const typeOptions = [
    { value: '', label: 'All' },
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' },
  ];

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));
  const goalOptions = goals.map(g => ({ value: g.id, label: g.name }));

  return (
    <div className={`transactions-container ${isSidebarOpen ? 'shifted' : ''}`}>
      <h2 className="title">User Transactions</h2>

      <h3 className="section-title">Filter by:</h3>
      <div className="filter-controls">
        <CustomSelectWithInput
          options={typeOptions}
          value={filterType}
          onChange={setFilterType}
          placeholder="Type"
        />
        <CustomSelectWithInput
          options={categoryOptions}
          value={filterCategory}
          onChange={setFilterCategory}
          placeholder="Category"
        />
      </div>

      <h3 className="section-title">Add New Transaction:</h3>
      <div className="new-transaction-form">
        <input
          type="number"
          placeholder="Amount"
          value={newAmount}
          onChange={e => setNewAmount(e.target.value)}
        />
        <CustomSelectWithInput
          options={typeOptions.slice(1)}
          value={newType}
          onChange={setNewType}
          placeholder="Type"
        />
        <CustomSelectWithInput
          options={categoryOptions}
          value={newCategoryInput}
          onChange={setNewCategoryInput}
          placeholder="Category"
        />
        <CustomSelectWithInput
          options={goalOptions}
          value={newGoalInput}
          onChange={setNewGoalInput}
          placeholder="Goal (optional)"
          readOnlyInput={true}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
        />
        <input
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
        />
        <button onClick={handleAddTransaction}>Add</button>
      </div>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Type</th>
            <th>Description</th>
            <th>Date</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => {
            if (editingTransaction && editingTransaction.id === t.id) {
              return (
                <tr key={t.id}>
                  <td>
                    <input
                      type="number"
                      value={editingTransaction.amount}
                      onChange={e =>
                        setEditingTransaction({
                          ...editingTransaction,
                          amount: Number(e.target.value),
                        })
                      }
                    />
                  </td>
                  <td>
                    <CustomSelectWithInput
                      options={typeOptions.slice(1)}
                      value={editingTransaction.type}
                      onChange={type =>
                        setEditingTransaction({
                          ...editingTransaction,
                          type,
                        })
                      }
                      placeholder="Type"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingTransaction.description}
                      onChange={e =>
                        setEditingTransaction({
                          ...editingTransaction,
                          description: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={editingTransaction.transactionDate}
                      onChange={e =>
                        setEditingTransaction({
                          ...editingTransaction,
                          transactionDate: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <CustomSelectWithInput
                      options={categoryOptions}
                      value={editingTransaction.category}
                      onChange={category =>
                        setEditingTransaction({
                          ...editingTransaction,
                          category,
                        })
                      }
                      placeholder="Category"
                    />
                  </td>
                  <td>
                    <button onClick={handleUpdateTransaction}>Save</button>
                    <button onClick={() => setEditingTransaction(null)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={t.id}>
                <td>{t.amount}</td>
                <td>{t.type}</td>
                <td>{t.description}</td>
                <td>{t.transactionDate}</td>
                <td>{t.category?.name || ''}</td>
                <td>
                  <button onClick={() => setEditingTransaction({
                    id: t.id,
                    amount: t.amount,
                    type: t.type,
                    description: t.description,
                    transactionDate: t.transactionDate,
                    category: t.category?.id || '',
                    goal: t.goalId || '',
                  })}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteTransaction(t.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={6}>No transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
