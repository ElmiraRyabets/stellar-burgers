import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv } from 'uuid';

export type BurgerConstructorState = {
  bun: TIngredient | undefined;
  ingredients: TConstructorIngredient[];
};

const initialState: BurgerConstructorState = {
  bun: undefined,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        action.payload.type == 'bun'
          ? (state.bun = action.payload)
          : state.ingredients.push(action.payload);
      }
    },
    resetConstructor: (state: BurgerConstructorState) => {
      state.ingredients = [];
      state.bun = undefined;
    },
    moveUpIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const { id } = action.payload;
      const currentItems = [...state.ingredients];
      const currentIndex = currentItems.findIndex((item) => item.id === id);
      if (currentIndex > 0) {
        const newItems = [...state.ingredients];
        const [movedItem] = newItems.splice(currentIndex, 1);
        newItems.splice(currentIndex - 1, 0, movedItem);
        return {
          ...state,
          ingredients: newItems
        };
      }
      return state;
    },
    moveDownIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const { id } = action.payload;
      const currentItems = [...state.ingredients];
      const currentIndex = currentItems.findIndex((item) => item.id === id);

      if (currentIndex < currentItems.length - 1) {
        const newItems = [...currentItems];
        const [movedItem] = newItems.splice(currentIndex, 1);
        newItems.splice(currentIndex + 1, 0, movedItem);
        return {
          ...state,
          ingredients: newItems
        };
      }
      return state;
    },
    removeIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const { id } = action.payload;
      const currentItems = [...state.ingredients];
      const indexToRemove = currentItems.findIndex((item) => item.id === id);
      currentItems.splice(indexToRemove, 1);
      return {
        ...state,
        ingredients: currentItems
      };
    }
  },
  selectors: {
    getBurgerConstructorData: (state) => state.ingredients,
    getBun: (state) => state.bun
  },
  extraReducers: () => {}
});

export const { getBurgerConstructorData, getBun } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;

export const {
  addIngredient,
  moveUpIngredient,
  moveDownIngredient,
  removeIngredient,
  resetConstructor
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
