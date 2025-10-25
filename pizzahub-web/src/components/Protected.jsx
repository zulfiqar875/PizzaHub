import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Protected({ role = 'any', children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== 'any' && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
