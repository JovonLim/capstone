import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    axios.post('http://127.0.0.1:8000/api/logout/', null, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Authorization': `Token ${token}`
        },
    }).then(response => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    });
  }
  return (
    <li className="nav-item">
      <button className="nav-link" onClick={handleLogout}>Logout</button>
    </li>    
  );
};

export default LogoutButton;
