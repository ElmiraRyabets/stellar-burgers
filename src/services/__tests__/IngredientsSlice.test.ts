import { describe, test } from '@jest/globals';
import {
  getIngredients,
  ingredientsReducer,
  initialState
} from '../ingredientsSlice';
import { ingredients } from '../mocks/MockIngredientsSliceData';

describe('тесты IngredientSlice', () => {
  const expectedResult = ingredients;

  test('загрузка ингредиентов', async () => {
    const state = ingredientsReducer(
      initialState,
      getIngredients.fulfilled(expectedResult, 'fulfilled')
    );
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(expectedResult);
  });

  test('ошибка во время загрузки', async () => {
    const state = ingredientsReducer(
      initialState,
      getIngredients.rejected(new Error('error'), 'rejected')
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('error');
  });

  test('тест загрузи при pending', async () => {
    const state = ingredientsReducer(
      initialState,
      getIngredients.pending('pending')
    );
    expect(state.status).toBe('loading');
  });
});
