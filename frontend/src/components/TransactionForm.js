import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

function TransactionForm({toggleForm}) {
  const [amt, setAmt] = useState('');
  const [trType, setTrType] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    if (selectedCategory === 'new_category') {
      setNewCategory('');
    }
  };

  return (
    <div className='center transaction'>
      <h3>Add new Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div class="form-group mb-3">
          <label> Amount:</label>
          <input className="form-control" type="number" step="0.01" required 
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
          />
        </div>

        <div class="form-group mb-3">
          <label>Transaction Type:</label>
          <select className="form-control" required
              value={trType} 
              onChange={(e) => setTrType(e.target.value)}>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        <div class="form-group mb-3">
          <label>Category:</label>
          <select className="form-control"
            value={category}
            onChange={handleCategoryChange}>
            <option value="others">Others</option>
            <option value="new_category">Define New Category</option>
          </select>
        </div>

        {category === 'new_category' && (
          <div class="form-group mb-3">
            <label>New Category:</label>
            <input className="form-control" type="text" required
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
        )}

        <div class="form-group mb-3">
          <label>Date:</label>
          <input className="form-control" type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>

        <div className='form-buttons'>
          <button type="submit" className='btn btn-primary'>Submit</button>
          <button className='btn btn-danger' onClick={toggleForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
