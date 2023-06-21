import React, { useState } from 'react';
import "../style/form.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
    }
    )
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

  let msg, amtInput; 
  if (error !== '') {
    msg = <p className="alert alert-danger">{error}</p>
  }
  if (!isLogin) {
    amtInput = 
    <div class="form-group mb-3">
      <label>Starting Amount</label>
      <input class="form-control" type="number" step="0.01" required
        value={amt}
        onChange={e => setAmt(e.target.value)}
      />
    </div>
  }
  return (
    <div class="center">
    <h3>{title}</h3>
    { msg }
    <form onSubmit={handleSubmit}>
      <div class="form-group mb-3">
        <label>Username</label>
        <input class="form-control" type="text" required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div class="form-group mb-3">
        <label>Password</label>
        <input class="form-control" type="password" required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {amtInput}
      <div class="submit">
        <button type="submit" class="btn btn-primary">{title}</button>
      </div>
    </form>
  </div>
  );
};

export default UserForm;