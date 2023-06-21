import React, { useState, useEffect } from 'react';
import "../style/transactions.css"
import "bootstrap/dist/css/bootstrap.min.css";
import TransactionForm from '../components/TransactionForm';
import axios from 'axios';

function TransactionsPage() {
  const [showform, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem('token');

  const toggleForm = () => {
    setShowForm(!showform);
  }

  useEffect(() => {
    fetchExpenses();
  }, [showform]);

  const fetchExpenses = () => {
    axios.get('http://127.0.0.1:8000/api/transactions/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(response => setTransactions(response.data));
  }

  return (
    <div className="container">
      <h1 className="title">All Transactions</h1>
      <div className="buttons">
        <button className="btn btn-secondary">Filter</button>
        <button className="btn btn-primary" onClick={toggleForm}>Add Transaction</button>
      </div>
      {showform && <TransactionForm toggleForm={toggleForm} token={token} />}

      {transactions.map((transaction) => (
        <div className='card'>{transaction.amt}</div>
      ))}
    </div>
  );
};

export default TransactionsPage;