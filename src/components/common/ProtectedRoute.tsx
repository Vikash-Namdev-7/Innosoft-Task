import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const isVerified = sessionStorage.getItem('ageVerified') === 'true';

  if (!isVerified) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
