import React, { useState, useEffect } from "react";
import axios from 'axios'
import Cookies from 'js-cookie';

function FilterOptions({toggleOption, token}) {

  const [trType, setTrType] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className='center transaction'>
      <h3>Filter</h3>
      <form onSubmit={handleSubmit}>
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
          <label>Categories:</label>
          {categories.map((category) => (
            <div key={category}>
              <input type="checkbox" value={category} />
              <label>{category}</label>
            </div>
          ))}
        </div>

        <div className='form-buttons'>
          <button type="submit" className='btn btn-primary'>Filter</button>
          <button className='btn btn-danger' type="button" onClick={toggleOption}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default FilterOptions;