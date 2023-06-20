import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/form.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Cookies from 'js-cookie';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [starting_amt, setStartingAmt] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/api/users/', { username, starting_amt, password }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
      }
    })
    .then((response) => {
      navigate('/login'); 
    })
    .catch((error) => {
        setError(error.response.data.username);
    });
  };

  let msg; 
  if (error !== '') {
    msg = <p className="alert alert-danger">{error}</p>
  }
  return (
    <div class="center">
      <h3>Register</h3>
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
        
        <div class="form-group mb-3">
          <label>Starting amount</label>
          <input class="form-control" type="number" required
            value={starting_amt}
            onChange={e => setStartingAmt(e.target.value)}
          />
        </div>
        
        <div class="submit">
          <button type="submit" class="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  );
};


export default RegisterPage;

