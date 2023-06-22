import React, { useState, useEffect } from 'react';
import "../style/transactions.css"
import "bootstrap/dist/css/bootstrap.min.css";
import TransactionForm from '../components/TransactionForm';
import axios from 'axios';

function TransactionsPage() {
  const [showform, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalpages, setTotalPages] = useState(1);
  const token = localStorage.getItem('token');

  const toggleForm = () => {
    setShowForm(!showform);
  }

  useEffect(() => {
    fetchExpenses();
  }, [showform, page]);

  const fetchExpenses = () => {
    axios.get(`http://127.0.0.1:8000/api/transactions/?page=${page}`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then(response => {
      setTotalPages(Math.ceil(response.data.count / 10));
      setTransactions(response.data.results);});
  }

  return (
    <div class="container-bg">
      <div className="container">
      <h1 className="title text-center">All Transactions</h1>
      <div className="buttons">
        <button className="btn btn-secondary">Filter</button>
        <button className="btn btn-primary" onClick={toggleForm}>Add Transaction</button>
      </div>
      {showform && <TransactionForm toggleForm={toggleForm} token={token} />}

      {transactions.map((transaction) => (
        <div key={transaction.id} className="card expense">
          <div className="card-header">
            <span>{transaction.date}</span>
          </div>
          <div className="body">
            <div className="headings">
              <span>{transaction.description}</span>
              <span>{transaction.category}</span>
            </div>
            <span className={"text-end " + (transaction.tr_type === "Expense" ? "text-danger" : "text-success")}>
            {transaction.tr_type === "Expense" ? "-" : "+"}{transaction.amt}
            </span>
          </div>
        </div>
       ))}
       <nav>
      <ul className="pagination">
      {page !== 1 && <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>}
      {(totalpages !== 1 && page !== totalpages) && <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>}
      </ul>
    </nav>
      </div>
      
    </div>
  );
};

export default TransactionsPage;