import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/Store';
import { getUserInfo } from '../../services/UserSlice';

export const AppHeader: FC = () => {
  const { name } = useSelector(getUserInfo);
  return <AppHeaderUI userName={name} />;
};
