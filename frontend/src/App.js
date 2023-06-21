import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import TransactionsPage from './pages/Transactions';
import NotFoundPage from './pages/NotFound';
import Navbar from './components/Navbar';

class App extends Component {
  render() {
    return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/expenses" element={<TransactionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    );
  }
};

export default App;