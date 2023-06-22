import React, { useState, useEffect } from 'react';
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'js-cookie';

function TransactionForm({toggleForm, token, transaction, setEditTransaction}) {
  const [amt, setAmt] = useState('');
  const [trType, setTrType] = useState('Expense');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('newCategory');
  const [newCategory, setNewCategory] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
 

  useEffect(() => {
    fetchExistingCategories();
    populateFields();
  }, []);

  const fetchExistingCategories = () => {
    axios.get('http://127.0.0.1:8000/api/transactions/get_categories/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(response => setCategories(response.data.categories));
  }

  const populateFields = () => {
    if (transaction.id) {
      setAmt(transaction.amt);
      setTrType(transaction.tr_type);
      setDesc(transaction.description);
      setCategory(transaction.category);
      setDate(transaction.date);
    }
  }

  const getDifferences = () => {
    const data = {};
    const submittedCategory = category === 'newCategory' ? newCategory : category;
    if (amt !== transaction.amt) {
      data['amt'] = amt;
    }
    if (trType !== transaction.tr_type) {
      data['tr_type'] = trType;
    }
    if (submittedCategory !== transaction.category) {
      data['category'] = submittedCategory;
    }
    if (desc !== transaction.description) {
      data['description'] = desc;
    }
    if (date !== transaction.date) {
      data['date'] = date;
    }
    return data
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
      'Authorization': `Token ${token}`
    };

    if (transaction.id) {
      const data = getDifferences();
      axios.patch(`http://127.0.0.1:8000/api/transactions/${transaction.id}/`, data, {
        headers: headers
      })
      .then(response=> {
        setEditTransaction({});
        toggleForm();
      })
      .catch(error => setError(error.response.data.amt));

    } else {
      const submittedCategory = category === 'newCategory' ? newCategory : category;
      axios.post('http://127.0.0.1:8000/api/transactions/', {
        amt: amt,
        description: desc,
        tr_type: trType,
        category: submittedCategory,
        date: date
    }, {
        headers: headers
      })
      .then(response => {
        setEditTransaction({});
        toggleForm();
      })
      .catch(error => setError(error.response.data.amt));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    if (selectedCategory === 'newCategory') {
      setNewCategory('');
    }
  };

  return (
    <div className='center transaction'>
      {transaction.id ? <h3>Edit Transaction</h3> : <h3>Add new Transaction</h3>}
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label> Amount:</label>
          <input className="form-control" type="number" step="0.01" required 
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label> Description:</label>
          <input className="form-control" type="text" maxLength={30}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Transaction Type:</label>
          <select className="form-control"
              value={trType} 
              onChange={(e) => setTrType(e.target.value)}>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        <div className="form-group mb-3">
          <label>Category:</label>
          <select className="form-control"
            value={category}
            onChange={handleCategoryChange}>
            <option value="newCategory">Define New Category</option>
            {categories.map((category) => (
            <option value={category}>{category}</option>))}
          </select>
        </div>

        {category === 'newCategory' && (
          <div className="form-group mb-3">
            <label>New Category:</label>
            <input className="form-control" type="text" required
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
        )}

        <div className="form-group mb-3">
          <label>Date:</label>
          <input className="form-control" type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>

        <div className='form-buttons'>
          <button type="submit" className='btn btn-primary'>Submit</button>
          <button className='btn btn-danger' type="button" onClick={() => {setEditTransaction({}); toggleForm();}}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
