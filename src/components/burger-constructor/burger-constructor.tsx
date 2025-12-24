import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getBurgerConstructorData,
  getBun,
  resetConstructor
} from '../../services/BurgerConstructorSlice';
import {
  getLastOrder,
  getOrderRequestStatus,
  isAuthenticated,
  newUserOrder,
  setLastOrder
} from '../../services/UserSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const items: TConstructorIngredient[] = useSelector(getBurgerConstructorData);
  const savedBun: TIngredient | undefined = useSelector(getBun);
  const dispatch = useDispatch();
  const constructorItems = {
    bun: savedBun,
    ingredients: items
  };

  const navigate = useNavigate();
  const isAuth = useSelector(isAuthenticated);
  const orderRequest = useSelector(getOrderRequestStatus);

  const orderModalData = useSelector(getLastOrder);

  const onOrderClick = () => {
    if (!isAuth) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredientsId: string[] = [
      constructorItems.bun._id,
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      )
    ];
    dispatch(newUserOrder(ingredientsId)).then(() => {
      dispatch(resetConstructor());
    });
  };
  const closeOrderModal = () => dispatch(setLastOrder(null));

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
