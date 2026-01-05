import {
  addIngredient,
  burgerConstructorReducer,
  initialState,
  moveDownIngredient,
  moveUpIngredient,
  removeIngredient,
  resetConstructor
} from '../BurgerConstructorSlice';
import {
  mockBun,
  mockIngredient1,
  mockIngredient2
} from '../mocks/MockBurgerConstructorSliceData';

describe('тесты burgerConstructorSlice', () => {
  describe('добавление продукта', () => {
    test('добавление булки', () => {
      const newState = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      const { bun } = newState;
      const actualCopy = JSON.parse(JSON.stringify({ ...bun }));
      const expectedCopy = JSON.parse(JSON.stringify({ ...mockBun }));
      delete expectedCopy.id;
      delete actualCopy.id;
      expect(actualCopy).toEqual(expectedCopy);
    });
    test('добавление ингредиента', () => {
      const newState = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      const { ingredients } = newState;

      const actualCopy = JSON.parse(JSON.stringify({ ...ingredients[0] }));
      const expectedCopy = JSON.parse(JSON.stringify({ ...mockIngredient1 }));

      delete expectedCopy.id;
      delete actualCopy.id;
      expect(actualCopy).toEqual(expectedCopy);
    });
  });

  describe('удаление ингредиента', () => {
    test('удаление ингредиента', () => {
      const withIngredient = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      const withoutIngredient = burgerConstructorReducer(
        withIngredient,
        removeIngredient('2')
      );
      const { ingredients } = withoutIngredient;
      expect(ingredients).toHaveLength(0);
    });
  });

  describe('перемещение продукта', () => {
    const initialState = {
      bun: null,
      ingredients: [mockIngredient1, mockIngredient2]
    };
    test('перемещение вверх', () => {
      const expectedResult = [mockIngredient2, mockIngredient1];
      const actualResult = burgerConstructorReducer(
        initialState,
        moveUpIngredient(mockIngredient2)
      );
      const { ingredients } = actualResult;

      expect(ingredients).toEqual(expectedResult);
    });
    test('перемещение вниз', () => {
      const expectedResult = [mockIngredient2, mockIngredient1];
      const actualResult = burgerConstructorReducer(
        initialState,
        moveDownIngredient(mockIngredient1)
      );
      const { ingredients } = actualResult;
      expect(ingredients).toEqual(expectedResult);
    });
  });

  describe('конструктор бургера', () => {
    test('очистка конструктора бургера', () => {
      const onlyBunBurger = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      const fullBurger = burgerConstructorReducer(
        onlyBunBurger,
        addIngredient(mockIngredient1)
      );
      const emptyBurger = burgerConstructorReducer(
        fullBurger,
        resetConstructor()
      );
      const { ingredients, bun } = emptyBurger;
      expect(ingredients).toEqual([]);
      expect(bun).toEqual(undefined);
    });
  });
});
