import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  function handlelogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }
  
  let links;
  if (token !== null) {
    links = 
    <>
    <li class="nav-item">
      <NavLink to="/" className="nav-link">All Expenses</NavLink>
    </li>
    <li class="nav-item">
      <button className="nav-link" onClick={handlelogout}>Logout</button>
    </li>
    </>
  } else {
    links = 
    <>
    <li class="nav-item">
      <NavLink to="/login" className="nav-link">Login</NavLink>
    </li>      
    <li class="nav-item">
      <NavLink to="/register" className="nav-link">Register</NavLink>
    </li>
    </>
  }
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
           <NavLink to="/" className="navbar-brand">ExpenseManager</NavLink>
          <div>
            <ul class="navbar-nav mr-auto">
              { links }      
            </ul>
          </div>
        </nav>
  );
}

export default Navbar;