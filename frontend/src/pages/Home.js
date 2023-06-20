import React, { Component } from "react";

class Home extends Component {
  render() {
    const token = localStorage.getItem('token');
    const text = token !== null ? <h2>Click on all expenses to check your expenses!</h2> :
    <h2>Sign in to start keeping track of your expenses!</h2>
    return (
      <div>
        <h1>Welcome to ExpenseManager</h1>
        { text }
      </div>
    );
  }
}

export default Home;