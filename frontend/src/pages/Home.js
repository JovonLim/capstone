import React, { Component } from "react";


class Home extends Component {
  render() {
    const token = localStorage.getItem('token');
    
    if (token !== null) {
      const user = JSON.parse(localStorage.getItem('user'));  
      return <div class="front title">
        <h1>Welcome Back {user.username}!</h1>
        <h2>Click on all transactions to check your transactions!</h2>
      </div>
    } else {
      return (
        <div class="front">
          <h1>Welcome to TransactionsTracker!</h1>
          <h2>Sign in to start keeping track of your various transactions!</h2>
        </div>
      );
    }
  } 
}

export default Home;