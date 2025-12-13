import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  getIngredientsData,
  getIngredients
} from '../../services/IngredientsSlice';
import { useDispatch } from '../../services/store';

import {
  getCurrentOrderInfo,
  getOrderByNumber,
  isOrderSearchSuccess
} from '../../services/UserSlice';

export const OrderInfo: FC = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const orderNumber: number = Number(params.number);
  const isSearchSuccess = useSelector(isOrderSearchSuccess);

  const orderData = useSelector(getCurrentOrderInfo)?.orders[0];

  useEffect(() => {
    /*если заказы уже загружены и номер текущего заказа не изменился, то не подгружаем заказы */
    if (!isSearchSuccess || orderNumber != orderData?.number) {
      dispatch(getOrderByNumber(orderNumber));
    }
    if (!ingredients) {
      dispatch(getIngredients());
    }
  }, [dispatch]);

  const ingredients: TIngredient[] = useSelector(getIngredientsData);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || !isSearchSuccess) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
