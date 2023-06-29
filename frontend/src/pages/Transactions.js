import React, { useState, useEffect, useRef } from 'react';
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
  const [disabled, setDisabled] = useState(false);
  const [notice, setNotice] = useState('');
  const [entries, setEntries] = useState(5);
  const token = localStorage.getItem('token');
  const fileInput = useRef(null);

  const openFile = () => {
    fileInput.current.value = '';
    fileInput.current.click();
  };

  const submitFile = (event) => {
    const file = event.target.files[0];
    if (file.type !== 'text/csv') {
      displayMsg('File is not a CSV');
      return;
    }
    const formData = new FormData();
    formData.append('csv_file', file);
    axios.post('http://127.0.0.1:8000/api/transactions/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `Token ${token}`
      }
    })
    .then(response => {
      displayMsg(response.data.message);

      const timer = setTimeout(() => {
        fetchExpenses(filteredDetails);
        displayMsg('Data Uploaded');
      }, 4500);

      return () => {
        clearTimeout(timer);
      }
    })
    .catch(error => {       
      displayMsg(error.response.data.error);
    });
  };

  const displayMsg = (msg) => {
    setNotice(msg);
    const timer = setTimeout(() => {
      setNotice('');
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  };

  const toggleForm = () => {
    setShowForm(!showform);
    setDisabled(!disabled);
  }

  const toggleOption = () => {
    setShowOption(!showOption);
    setDisabled(!disabled);
  }

  useEffect(() => {
    fetchExpenses(filteredDetails);
  }, [showform, showOption, page, entries]);

  const fetchExpenses = (params) => {
    params['page_size'] = entries;
    axios.get(`http://127.0.0.1:8000/api/transactions/?page=${page}`, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }).then(response => {
      setTotalPages(Math.ceil(response.data.count / entries));
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
        fetchExpenses(filteredDetails);
      }
    });
  }

  const editExpense = (transaction) => {
    setEditTransaction(transaction);
    toggleForm();
  }

  return (
    <div className="container">
      <h1 className="text-center mt-3">Transactions</h1>
      <div className="transaction-page-btns">
        <button className="btn btn-secondary button-text" onClick={toggleOption} disabled={disabled}>Filter</button>
        <button className="btn btn-primary button-text" onClick={toggleForm} disabled={disabled}>Add Transaction</button>
      </div>
      <div className="transaction-page-btns mt-3">
        <div className="pagination">
          <h5>No. of Entries Per Page</h5>
          <select value={entries} onChange={(e) => { setEntries(e.target.value); setPage(1); }}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <button className="btn btn-primary button-text" onClick={openFile} disabled={disabled}>Upload CSV</button>
        <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={submitFile} />
      </div>
      {notice && <div className={"alert alert-primary mt-2 text-center notice-animate"}>{notice}</div>}
      {showform && <TransactionForm toggleForm={toggleForm} token={token} transaction={editTransaction}
       setEditTransaction={setEditTransaction} displayMsg={displayMsg} />}
      {showOption && <FilterOptions filteredDetails={filteredDetails} setFilteredDetails={setFilteredDetails}
       toggleOption={toggleOption} token={token} setPage={setPage} displayMsg={displayMsg}/>}
      {transactions.map((transaction) => (
        <div key={transaction.id} className="card transaction card-animate">
          <div className="card-header headings bg-dark text-white">
            <span>{transaction.date}</span>
            <div className='transaction-btns'>
              <button type="button" className="btn btn-transparent shadow-none" onClick={() => editExpense(transaction)} disabled={disabled}>
                <span className="button-text text-white">Edit</span></button>
              <button type="button" className="btn-close-white btn-close shadow-none" onClick={() => deleteExpense(transaction.id)}></button>
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
      <div>
      {page !== 1 && <button className="button-text btn btn-dark" onClick={() => setPage(page - 1)}>Previous</button>}
      {(totalpages > 1 && page !== totalpages) 
        && <button className="button-text btn btn-dark" onClick={() => setPage(page + 1)}>Next</button>}
      </div>
    </nav>
  </div>
  );
};

export default TransactionsPage;