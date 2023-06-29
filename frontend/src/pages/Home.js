import React, { Component } from "react";


class Home extends Component {
  render() {
    const token = localStorage.getItem('token');
    
    if (token !== null) {
      const user = JSON.parse(localStorage.getItem('user'));  
      return <div className="front mt-5">
        <h1 className="h1-fade-in">Welcome Back {user.username}!</h1>
        <h2 className="h2-fade-in mt-5">Click on transactions to manage your transactions!</h2>
        <h2 className="h2-fade-in mt-5">Click on profile to set your budget and view associated statistics!</h2>
      </div>
    } else {
      return (
        <div className="front mt-5">
          <h1 className="h1-fade-in">Welcome to TransactionsTracker!</h1>
          <h2 className="h2-fade-in mt-5">Sign in to start keeping track of your various transactions!</h2>
        </div>
      );
    }
  } 
}

export default Home;