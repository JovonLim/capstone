import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';

function RegisterPage() {
  const navigate = useNavigate();
  return (<UserForm navigate={navigate} isLogin={false} title={'Register'} />);
};

export default RegisterPage;

