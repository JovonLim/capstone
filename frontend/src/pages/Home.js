import React, { Component } from "react";
import "../style/home.css";

class Home extends Component {
  render() {
    const token = localStorage.getItem('token');
    
    if (token !== null) {
      const user = localStorage.getItem('user');
      return <div>
        <h1>Welcome {user}!</h1>
        <h2>Click on all expenses to check your expenses!</h2>
      </div>
    } else {
      return (
        <div>
          <h1>Welcome to ExpenseManager!</h1>
          <h2>Sign in to start keeping track of your expenses!</h2>
        </div>
      );
    }
  } 
}

export default Home;