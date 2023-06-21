import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';

function LoginPage() {
  const navigate = useNavigate();
  return (<UserForm navigate={navigate} isLogin={true} title={'Login'} />);
};

export default LoginPage;
