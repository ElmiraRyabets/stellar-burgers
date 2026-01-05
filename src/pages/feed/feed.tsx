import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/Store';
import { getAllOrders, getOrdersData } from '../../services/AllOrdersSlice';
import { useDispatch } from '../../services/Store';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getOrdersData);

  const dispatch = useDispatch();
  const handleGetFeeds = () => {
    dispatch(getAllOrders());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
