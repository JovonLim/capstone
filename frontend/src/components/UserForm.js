import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function UserForm({ navigate, isLogin, title }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [amt, setAmt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
        localStorage.setItem('user', user);
        navigate('/');
      } else {
        navigate('/login');
      }
    })
    .catch((error) => {
      console.log(error);
      const data = error.response.data;
      if (data.username) {
        setError(data.username);
      } else {
        setError(data.starting_amt);
      }
    });
  };

  let amtInput; 
  if (!isLogin) {
    amtInput = 
    <div className="form-group mb-3">
      <label>Starting Amount</label>
      <input className="form-control" type="number" step="0.01" required
        value={amt}
        onChange={e => setAmt(e.target.value)}
      />
    </div>
  }
  return (
    <div className="center user">
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
      {amtInput}
      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">{title}</button>
      </div>
    </form>
  </div>
  );
};

export default UserForm;