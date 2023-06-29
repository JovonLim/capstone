import React, { useState, useEffect } from "react";
import axios from 'axios'

function FilterOptions({filteredDetails, setFilteredDetails, toggleOption, token, setPage, displayMsg}) {

  const [trType, setTrType] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    populateFilter();
    fetchExistingCategories();
  }, []);

  const fetchExistingCategories = () => {
    axios.get('http://127.0.0.1:8000/api/transactions/get_categories/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(response => setCategories(response.data.categories));
  }

  const toggleCategory = (category, e) => {
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(sel_category => sel_category !== category));
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(from) > new Date(to)) {
      setError(true);
    } else {
      setFilter();
      setPage(1);
      displayMsg('Filtered Transactions!');
      toggleOption();
    }
  }

  const populateFilter = () => {
    setTrType(filteredDetails['tr_type']);
    setSelectedCategories(filteredDetails['categories']);
    setFrom(filteredDetails['from']);
    setTo(filteredDetails['to']);
  };

  const setFilter = () => {
    const filter = {
      tr_type: trType,
      categories: selectedCategories,
      from: from,
      to: to
    };
    setFilteredDetails(filter);
  };

  return (
    <div className='center transaction-form form-animate rounded border border-white'>
      <h3>Filter</h3>
      {error && <p className="alert alert-danger filter-error">To Date must be after From Date!</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Transaction Type:</label>
          <select className="form-control"
            value={trType} 
            onChange={(e) => setTrType(e.target.value)}>
            <option value="">None</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        <div className="form-group mb-3">
          <label>Categories:</label>
          {categories.map((category) => (
            <div key={category}>
              <input type="checkbox" value={category} style={{marginRight:'5px'}} 
                checked={selectedCategories.includes(category)} onChange={(e) => toggleCategory(category, e)} />
              <label>{category}</label>
            </div>
          ))}
        </div>
        <div className="form-group mb-3">
          <label>From:</label>
          <input className="form-control" type="date" 
            value={from} 
            onChange={(e) => setFrom(e.target.value)} 
          />
        </div>

        <div className="form-group mb-3">
            <label>To:</label>
            <input className="form-control" type="date"
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
            />
          </div>

        <div className='transaction-form-btns'>
          <button type="submit" className='btn btn-primary'>Filter</button>
          <button className='btn btn-danger' type="button" onClick={toggleOption}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default FilterOptions;