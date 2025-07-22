import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    // Handle loading state
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
