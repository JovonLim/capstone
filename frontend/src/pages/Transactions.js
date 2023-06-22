import React, { useState, useEffect } from 'react';
import "../style/transactions.css"
import "bootstrap/dist/css/bootstrap.min.css";
import TransactionForm from '../components/TransactionForm';
import axios from 'axios';
import Cookies from 'js-cookie';

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
      console.log(response);
      setTotalPages(Math.ceil(response.data.count / 5));
      setTransactions(response.data.results);});
  }

  const deleteExpense = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/transactions/${id}/`, {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `Token ${token}`
      }
    }).then(response => {
      if (transactions.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchExpenses();
      }
    });
  }

  return (
    <div class="container-bg">
      <div className="container">
      <h1 className="title text-center">All Transactions</h1>
      <div className="buttons">
        <button className="btn btn-secondary"><span className="button-text">Filter</span></button>
        <button className="btn btn-primary" onClick={toggleForm}><span className="button-text">Add Transaction</span></button>
      </div>
      {showform && <TransactionForm toggleForm={toggleForm} token={token} />}

      {transactions.map((transaction) => (
        <div key={transaction.id} className="card expense">
          <div className="card-header headings">
            <span>{transaction.date}</span>
            <div className='expense-btns'>
              <button type="button" className="btn btn-transparent shadow-none"><span className="button-text">Edit</span></button>
              <button type="button" className="btn-close shadow-none" onClick={() => deleteExpense(transaction.id)}></button>
            </div>
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
      {page !== 1 && <button className="page-link" onClick={() => setPage(page - 1)}><span className="button-text">Previous</span></button>}
      {(totalpages > 1 && page !== totalpages) 
        && <button className="page-link" onClick={() => setPage(page + 1)}><span className="button-text">Next</span></button>}
      </ul>
    </nav>
      </div>
      
    </div>
  );
};

export default TransactionsPage;