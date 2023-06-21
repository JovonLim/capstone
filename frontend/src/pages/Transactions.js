import React, { useState } from 'react';
import "../style/transactions.css"
import "bootstrap/dist/css/bootstrap.min.css";
import TransactionForm from '../components/TransactionForm';

function TransactionsPage() {
  const [showform, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showform);
  }

  return (
    <div className="container">
      <h1 className="title">All Transaction</h1>
      <div className="buttons">
        <button className="btn btn-secondary">Filter</button>
        <button className="btn btn-primary" onClick={toggleForm}>Add Transactions</button>
      </div>
      {showform && <TransactionForm toggleForm={toggleForm}/>}
    </div>
  );
};

export default TransactionsPage;