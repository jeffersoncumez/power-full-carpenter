import useAuthGuard from '../../hooks/useAuthGuard';

export default function PrivateRoute({ children, allowedRoles }) {
  const user = useAuthGuard(allowedRoles);
  if (!user) return null; // Mientras redirige, no renderiza nada
  return children;
}
