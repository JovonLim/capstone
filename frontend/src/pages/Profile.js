import React, { useState, useEffect } from "react";
import axios from 'axios';
import Budget from "../components/Budget";
import Cookies from 'js-cookie';
import Statistics from "../components/Statistics";

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const date = new Date(user.date_joined).toDateString();
  const [count, setCount] = useState({
    totalTransaction: 0,
    totalExpense: 0,
    totalIncome: 0,
    currTransaction: 0,
    currExpense: 0,
    currIncome: 0
  });
  const [remainder, setRemainder] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    function fetchCount() {
      axios.get("http://127.0.0.1:8000/api/transactions/get_count/", {
        headers: {
          'Authorization': `Token ${token}`  
        }
      }).then(response => {
        const { totalTransaction, totalExpense, totalIncome,
          currTransaction, currExpense, currIncome } = response.data;
        setCount({ totalTransaction, totalExpense, totalIncome,
          currTransaction, currExpense, currIncome });
      }) 
    }

    function fetchTotal() {
      axios.get("http://127.0.0.1:8000/api/transactions/get_net_total/", {
        headers: {
          'Authorization': `Token ${token}`  
        }
      }).then(response => {
        const { total } = response.data;
        setRemainder((parseFloat(user.starting_amt) + total).toFixed(2));
      }) 
    }
    fetchCount();
    fetchTotal();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    setPassword('');
    setConfirmPassword('');
  }

  const displayMsg = () => {
    const timer = setTimeout(() => {
      setSuccess(false);
    }, 4000); 
  
    return () => {
      clearTimeout(timer); 
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password does not match");
      return;
    }
    axios.patch(`http://127.0.0.1:8000/api/users/${user.id}/`, {
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `Token ${token}`
      }
    })
    .then(response => {
      toggleForm();
      setSuccess(true);
      displayMsg();
    });
  }

  return (
    <div className="container-fluid">
      <div className="row mt-5">
        <div className="col">
          <Budget token={token} />
        </div>
        <div className="col-md-8">
          <div className="row m-3">
            <div className="col-8">
              <h1>{user.username}</h1>
              <h1>Date Joined: {date}</h1>
              <h1 className="balance">Current Balance: {remainder}</h1>
              <h2 className="currTransaction">Transactions this month: {count.currTransaction} </h2>
              <h2 className="currExpense">Expenses this month: {count.currExpense} </h2>
              <h2 className="currIncome">Income this month: {count.currIncome} </h2>
            </div>
            <div className="col-4 text-end">
              <button className="btn btn-danger button-text" onClick={toggleForm}>Change Password</button>
              {success && <div className="alert alert-primary text-center mt-3 success-animate">Password successfully changed!</div>}
              {showForm && (
                <div className="card profile-form bg-dark text-white mt-2">
                  {error && <p className="alert alert-danger text-center">{error}</p>}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-2">
                      <label>New Password</label>
                      <input className="form-control" type="password" required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  <div className="form-group mb-2">
                    <label>Confirm Password</label>
                    <input className="form-control" type="password" required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary button-text">Submit</button>
                </form>
              </div>)}
            </div>
          </div>  
          <div className="row mt-5 mx-3 mb-3 text-center total">
            <div className="col bg-info">
              <h4>Total Transactions:</h4>
              <h4>{count.totalTransaction}</h4>
            </div>
            <div className="col bg-danger">
              <h4>Total Expenses:</h4>
              <h4>{count.totalExpense}</h4>
            </div>
            <div className="col bg-success">
              <h4>Total Income:</h4>
              <h4>{count.totalIncome}</h4>
            </div>
         </div>
        </div>
      </div>
    <hr class="hr" />
    <h1 className="text-center statistics">Statistics</h1>
    < Statistics token={token} />
  </div>
  );
}

export default ProfilePage;