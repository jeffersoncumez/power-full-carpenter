import { useNavigate } from 'react-router-dom';

export default function useRedirectByRole() {
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    if (!role) {
      navigate('/login');
      return;
    }

    // 👇 normalizamos a minúsculas
    const r = role.toLowerCase();

    switch (r) {
      case 'supervisor':
        navigate('/dashboard');
        break;
      case 'inventario':
        navigate('/inventario');
        break;
      case 'operario':
        navigate('/kanban');
        break;
      default:
        navigate('/login');
    }
  };

  return redirectByRole;
}
