import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientsData } from '../../services/IngredientsSlice';
import { getOrdersData } from '../../services/AllOrdersSlice';

export const OrderInfo: FC = () => {
  const params = useParams();
  const orderId: string | undefined = params.number;

  if (!orderId) {
    return <Preloader />;
  }

  const ingredients: TIngredient[] = useSelector(getIngredientsData);
  const orders: TOrder[] = useSelector(getOrdersData);

  const order: TOrder = orders.filter(
    (item: TOrder) => item.number == +orderId
  )[0];

  const orderData = {
    createdAt: order.createdAt,
    ingredients: order.ingredients,
    _id: order._id,
    status: order.status,
    name: order.name,
    updatedAt: order.updatedAt,
    number: order.number
  };

  /* Готовим данные для отображения */
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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
