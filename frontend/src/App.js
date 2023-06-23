import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import TransactionsPage from './pages/Transactions';
import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';
import Navbar from './components/Navbar';

const ProtectedRoute = () => {
  if (!localStorage.getItem('token')) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

class App extends Component {
  render() {
    return (
    <Router>
      <div className="bg">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/expenses" element={<TransactionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
    );
  }
};

export default App;