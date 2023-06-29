import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';

function UserForm({ navigate, isLogin, title }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [amt, setAmt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && (password !== confirmPassword)) {
      setError("Password does not match");
      return;
    }
    const url = isLogin ? 'http://127.0.0.1:8000/api/login/' : 'http://127.0.0.1:8000/api/users/'; 
    axios.post(url, { 
      username:username,
      password:password,
      starting_amt: parseFloat(amt)
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
      }
    })
    .then((response) => {
      if (isLogin) {
        const receivedToken = response.data['token'];
        const user = response.data['user'];
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      } else {
        navigate('/login');
      }
    })
    .catch((error) => {
      const data = error.response.data;
      if (data.username) {
        setError(data.username);
      } else {
        setError(data.starting_amt);
      }
    });
  };

  let extraInput; 
  if (!isLogin) {
     extraInput = 
     <>
      <div className="form-group mb-3">
        <label>Confirm Password</label>
        <input className="form-control" type="password" required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
      </div>
     
      <div className="form-group mb-3">
        <label>Starting Amount</label>
        <input className="form-control" type="number" step="0.01" required
          value={amt}
          onChange={e => setAmt(e.target.value)}
        />
      </div>
    </>
  }
  return (
    <div className="center user rounded border border-white">
      <h3>{title}</h3>
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Username</label>
          <input className="form-control" type="text" required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Password</label>
          <input className="form-control" type="password" required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {extraInput}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">{title}</button>
        </div>
      </form>
      {isLogin && (<h5 className='text-center mt-3'>Don't have an account?
       Click <NavLink to="/register">here</NavLink> to register!</h5>)}
  </div>
  );
};

export default UserForm;