import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import useRedirectByRole from './useRedirectByRole';

export default function useAuthGuard(allowedRoles = []) {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const redirectByRole = useRedirectByRole();

  useEffect(() => {
    if (!user) {
      // No autenticado → al login
      navigate('/login', { replace: true });
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Usuario con rol distinto → redirigir a su página principal
      redirectByRole(user.role);
    }
  }, [user, navigate, allowedRoles, redirectByRole]);

  return user;
}
