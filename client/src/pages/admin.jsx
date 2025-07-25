import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../components/context/UserContext';

function AdminRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;