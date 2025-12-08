import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';
import { getIngredientsData } from '../../services/IngredientsSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const params = useParams();
  const id = params.id;
  const items: TIngredient[] = useSelector(getIngredientsData);
  const ingredientData: TIngredient = items.filter((item: TIngredient) => item._id == id)[0];

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
