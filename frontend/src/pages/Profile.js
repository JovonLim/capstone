import React, { useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const date = new Date(user.date_joined).toDateString();
  const [showForm, setShowForm] = useState(false);
  const [budget, setBudget] = useState('');

  const toggleForm = () => {
    setShowForm(!showForm);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:8000/api/budgets/", {
      budget: budget
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `Token ${token}`
      }
    })
    .then(response => {
      console.log(response);
      setBudget(response.data);
    })
  }

  return (

    <div className="container-fluid">
    <div className="row">
      <div className="col mt-5">
        <div class="card">
          {budget !== '' ? (<h3>Remaining Budget For This Month:</h3>) : 
          (<div className="text-center"><h3>You have not set a budget for this month!</h3>
            <h4>Click the set budget button to begin!</h4></div>)}
          
          <div className="form-buttons">
            <button className="btn btn-secondary" type="button" onClick={toggleForm}>
              <span className="button-text">Set Budget</span>
            </button>
          </div>
          
          {showForm && (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Budget</label>
                <input className="form-control" type="number" step="0.01" required
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit"><span className="button-text">Submit</span></button>
            </form>
          )}
        </div>
      </div>
      <div className="col-md-9 title">
      <h1>{user.username}</h1>
      <h2>Date Joined: {date}</h2>
      <h4>Current Balance: {user.starting_amt}</h4>
      </div>
    </div>
  </div>
  );
}

export default ProfilePage;