import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/form.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Cookies from 'js-cookie';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/login/', { 
      username:username,
      password:password 
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
      }
    }
    )
    .then((response) => {
      const receivedToken = response.data['token'];
      localStorage.setItem('token', receivedToken);
      navigate('/');
    })
    .catch((error) => {
        setError(error.response.data.error);
    });
  };

  let msg; 
  if (error !== '') {
    msg = <p className="alert alert-danger">{error}</p>
  }
  return (
    <div class="center">
    <h3>Login</h3>
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
      
      <div class="submit">
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
    </form>
  </div>
  );
};

export default LoginPage;
