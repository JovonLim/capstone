import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutBtn';

function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  let links;
  if (token !== null) {
    links = 
    <>
    <li class="nav-item">
      <NavLink to="/expenses" className="nav-link" style={{fontFamily: 'cursive'}}>Transactions</NavLink>
    </li>
    <li class="nav-item">
      <NavLink to="/profile" className="nav-link" style={{fontFamily: 'cursive'}}>Profile</NavLink>
    </li>
    <li class="nav-item">
      < LogoutButton />
    </li>
    </>
  } else {
    links = 
    <>
    <li class="nav-item">
      <NavLink to="/login" className="nav-link" style={{fontFamily: 'cursive'}}>Login</NavLink>
    </li>      
    <li class="nav-item">
      <NavLink to="/register" className="nav-link" style={{fontFamily: 'cursive'}}>Register</NavLink>
    </li>
    </>
  }
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
           <NavLink to="/" className="navbar-brand" style={{fontFamily: 'cursive'}}>TransactionsTracker</NavLink>
          <div>
            <ul class="navbar-nav mr-auto">
              { links }      
            </ul>
          </div>
        </nav>
  );
}

export default Navbar;