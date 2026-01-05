import { useSelector } from '../../services/Store';
import { Navigate, useLocation } from 'react-router';
import { Preloader } from '../ui/preloader';
import {
  getStatus,
  getUserInfo,
  isAuthenticated
} from '../../services/UserSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const status = useSelector(getStatus);
  const isAuth = useSelector(isAuthenticated);
  const location = useLocation();

  if (status == 'loading') {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuth && status == 'succeeded') {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} state={{ from: location }} />;
  }

  return children;
};
