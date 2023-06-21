import React, { Component } from "react";
import "../style/home.css";

class Home extends Component {
  render() {
    const token = localStorage.getItem('token');
    
    if (token !== null) {
      const user = localStorage.getItem('user');
      return <div id="home">
        <h1>Welcome {user}!</h1>
        <h2>Click on all transactions to check your transactions!</h2>
      </div>
    } else {
      return (
        <div id="home">
          <h1>Welcome to TransactionsManager!</h1>
          <h2>Sign in to start keeping track of your various transactions!</h2>
        </div>
      );
    }
  } 
}

export default Home;