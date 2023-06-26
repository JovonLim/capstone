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
    transaction: 0,
    expense: 0,
    income: 0
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
        const { transaction, expense, income } = response.data;
        setCount({ transaction, expense, income });
      }) 
    }

    function fetchTotal() {
      axios.get("http://127.0.0.1:8000/api/transactions/get_net_total/", {
        headers: {
          'Authorization': `Token ${token}`  
        }
      }).then(response => {
        const { total } = response.data;
        setRemainder(parseFloat(user.starting_amt) + total);
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
      }, 3000); 
  
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
      <div className="row">
        <div className="col mt-5">
        <Budget token={token} />
        </div>
        <div className="col-md-8 offset-1">
          <div className="row mt-5 mb-5">
            <div className="bg-primary col-2 offset-1 text-center rounded">
              <h4>Transactions Made:</h4>
              <h4>{count.transaction}</h4>
            </div>
            <div className="bg-danger col-2 offset-1 text-center rounded">
              <h4>Expense Entries:</h4>
              <h4>{count.expense}</h4>
            </div>
            <div className="bg-success col-2 offset-1 text-center rounded">
              <h4>Income Entries:</h4>
              <h4>{count.income}</h4>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h1>{user.username}</h1>
              <h2>Date Joined: {date}</h2>
              <h2>Current Balance: {remainder}</h2>
            </div>
            <div className="col text-end">
              <button className="btn btn-danger" onClick={toggleForm}><span className="button-text">Change Password</span></button>
              {success && <p className="alert alert-primary text-center mt-3">Password successfully changed!</p>}
              {showForm && (
                <div className="card profile-form mt-3">
                  {error && <p className="alert alert-danger text-center">{error}</p>}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                      <label>New Password</label>
                      <input className="form-control" type="password" required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  <div className="form-group mb-3">
                    <label>Confirm Password</label>
                    <input className="form-control" type="password" required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary"><span className="button-text">Submit</span></button>
                </form>
              </div>
              )}
            </div>
          </div>  
        </div>
      </div>
    <hr class="hr" />
    <h1 className="text-center">Statistics</h1>
    < Statistics token={token} />
  </div>
  );
}

export default ProfilePage;