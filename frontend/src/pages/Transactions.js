import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import FilterOptions from '../components/FilterOptions';
import axios from 'axios';
import Cookies from 'js-cookie';

function TransactionsPage() {
  const [showform, setShowForm] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState({
    tr_type: '',
    categories: [],
    from: '',
    to: ''
  });
  const [editTransaction, setEditTransaction] = useState({});
  const [page, setPage] = useState(1);
  const [totalpages, setTotalPages] = useState(1);
  const token = localStorage.getItem('token');

  const toggleForm = () => {
    setShowForm(!showform);
  }

  const toggleOption = () => {
    setShowOption(!showOption);
  }

  useEffect(() => {
    fetchExpenses(filteredDetails);
  }, [showform, showOption, page]);

  const fetchExpenses = (params) => {
    axios.get(`http://127.0.0.1:8000/api/transactions/?page=${page}`, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }).then(response => {
      setTotalPages(Math.ceil(response.data.count / 5));
      setTransactions(response.data.results);
    });
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

  const editExpense = (transaction) => {
    setEditTransaction(transaction);
    toggleForm();
  }

  return (
    <div className="container">
      <h1 className="title text-center">All Transactions</h1>
      <div className="transaction-page-btns">
        <button className="btn btn-secondary" onClick={toggleOption}><span className="button-text">Filter</span></button>
        <button className="btn btn-primary" onClick={toggleForm}><span className="button-text">Add Transaction</span></button>
      </div>
      {showform && <TransactionForm toggleForm={toggleForm} token={token} transaction={editTransaction} setEditTransaction={setEditTransaction} />}
      {showOption && <FilterOptions filteredDetails={filteredDetails} setFilteredDetails={setFilteredDetails}
       toggleOption={toggleOption} token={token} setPage={setPage} />}
      {transactions.map((transaction) => (
        <div key={transaction.id} className="card transaction">
          <div className="card-header headings">
            <span>{transaction.date}</span>
            <div className='transaction-btns'>
              <button type="button" className="btn btn-transparent shadow-none" onClick={() => editExpense(transaction)}><span className="button-text">Edit</span></button>
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
  );
};

export default TransactionsPage;