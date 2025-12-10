import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { getUserOrderInfo } from '../../services/UserSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getUserOrderInfo);
  
  return <ProfileOrdersUI orders={orders} />;
};
